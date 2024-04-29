"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { z } from "zod";
import {
  ChevronsRight,
  ExternalLink,
  LinkIcon,
  Users,
  MapPin,
  Target,
  ShieldQuestion,
  Quote,
  Layers,
  UserIcon,
  CircleUserRound,
  LightbulbIcon,
  ChevronDown,
} from "lucide-react";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Insight } from "@/types/insight";
import { getInsight } from "@/utils/nectar/insights";
import { getUserAccessToken } from "@/utils/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { type DataRecord } from "@/types/record";
import { type Company, type Contact } from "@/types/contact";
import { humanDate, getNameInitials, titleCaseToCamelCase } from "@/utils/misc";
import { DataTable } from "@/components/data-table/data-table";
import { RecordDetails } from "@/components/record/RecordDetails";
import {
  TableRecord,
  type RecordSchema,
  recordFilters,
  getRecordColumns,
} from "@/components/insight/record-columns";
import {
  CompanyRecord,
  type CompanySchema,
  companyFilters,
  fixedCompanyColumns,
} from "@/components/insight/company-columns";
import {
  ContactRecord,
  type ContactSchema,
  contactFilters,
  fixedContactColumns,
} from "@/components/insight/contact-columns";

interface InsightDetailsProps {
  insightId: string;
}

export function InsightDetails({ insightId }: InsightDetailsProps) {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [records, setRecords] = useState<Map<string, DataRecord>>(new Map());
  const [dataRecords, setDataRecords] = useState<RecordSchema[]>([]);
  const [recordSheetOpen, setRecordSheetOpen] = useState(false);
  const [selectedRecordRow, setSelectedRecordRow] = useState<DataRecord | null>(
    null,
  );
  const [companyRecords, setCompanyRecords] = useState<CompanySchema[]>([]);
  const [contactRecords, setContactRecords] = useState<ContactSchema[]>([]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        const ins = await getInsight(userToken, insightId);
        setInsight(ins);

        // Set Records
        const tableRecs = z.array(TableRecord).parse(
          ins.records.map((rec: DataRecord) => {
            const record: Record<string, any> = {
              id: rec.id,
              date: new Date(rec.startedAt),
              dataSourceName: rec.dataSource.name,
              utm: rec.utm.toString(),
              name: rec.externalName,
              type: rec.type,
            };
            rec.scores.forEach((item) => {
              record[titleCaseToCamelCase(item.name)] = item.value;
            });

            return record;
          }),
        );
        setDataRecords(tableRecs);

        const recordMap = new Map<string, DataRecord>();
        ins.records.forEach((r: DataRecord) => recordMap.set(r.id, r));
        setRecords(recordMap);

        // Set companies
        const companyRecs = z.array(CompanyRecord).parse(
          ins.companies.map((comp: Company) => {
            const company: Record<string, any> = {
              id: comp.id,
              name: comp.name,
              size: comp.size,
              industry: comp.industry,
              country: comp.location !== null ? comp.location.country : "-",
              plan: comp.plan !== null ? comp.plan.name : "-",
              arr: comp.monthlySpend * 12,
              userCount: comp.userCount,
            };
            return company;
          }),
        );
        setCompanyRecords(companyRecs);

        // Set contacts
        const contactRecs = z.array(ContactRecord).parse(
          ins.contacts.map((cont: Contact) => {
            const contact: Record<string, any> = {
              id: cont.id,
              name: cont.name,
              country: cont.location !== null ? cont.location.country : "-",
              company: cont.companies.length > 0 ? cont.companies[0].name : "-",
            };
            return contact;
          }),
        );
        setContactRecords(contactRecs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSurvey();
  }, [insightId]);

  const handleRecordOpenSheet = function <TData>(data: TData) {
    setRecordSheetOpen(true);
    const record: RecordSchema = data as RecordSchema;
    const rec: DataRecord | undefined = records.get(record.id);
    if (rec === undefined) {
      return;
    }
    setSelectedRecordRow(rec);
  };

  const handleRecordCloseSheet = function () {
    setRecordSheetOpen(false);
  };

  const handleCopyRecordLink = async (recordId: string | undefined) => {
    try {
      const currentDomain = window.location.host;
      await navigator.clipboard.writeText(
        `https://${currentDomain}/records/${recordId}`,
      );
      toast.success("Record link copied!");
    } catch (error: any) {
      toast.error("Failed to copy record link.", {
        description: error.toString(),
      });
    }
  };

  const timeline = [
    {
      id: 1,
      content: "created selection",
      target: "Robin",
      href: "#",
      date: "Apr 26",
      datetime: "2020-09-20",
    },
    {
      id: 2,
      content: "drafted insight",
      target: "Nectar",
      href: "#",
      date: "Apr 26",
      datetime: "2020-09-22",
    },
  ];

  // Function to select the text of the <p> element

  return (
    <>
      <Toaster theme="light" />
      {insight !== null ? (
        <div>
          <div className="bg-white rounded-lg mt-3 mx-4">
            <div className="flex flex-row h-14 px-10 items-center mt-2 border-zinc-200 border-b justify-between">
              <p className="text-base text-medium">{insight.insight.title}</p>
              <Button variant="outline" size="sm" disabled={true}>
                Link
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <div className="flex-1 space-y-4 px-10">
                <div className="flex flex-col w-full pb-6 justify-start space-y-2 mt-12">
                  <div className="flex flex-row items-center gap-x-1 text-xs">
                    <Button variant="outline" size="sm" disabled={false}>
                      4w&apos;s
                      <span>
                        <ChevronDown size={"15"}></ChevronDown>
                      </span>
                    </Button>

                    <Button variant="outline" size="sm" disabled={false}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-ellipsis-vertical"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </div>
                  <h2 className="text-2xl font-medium tracking-tight text-zinc-600 w-3/4 py-2">
                    {insight.insight.statement}
                  </h2>
                  <div className="flex flex-row items-center gap-x-1 text-xs">
                    <p className="text-zinc-700">Nectar</p>
                    <p className="text-zinc-400">drafted insight</p>
                    <p className="text-zinc-400">·</p>
                    <p className="text-zinc-400">
                      {humanDate(new Date(insight.createdAt), false)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 space-y-0">
                  <div className="flex px-2.5 rounded-lg bg-zinc-100 items-center gap-x-1">
                    <CircleUserRound size={"15"} className="text-zinc-600" />
                    <p className="text-sm text-zinc-600">Who</p>
                    <span className="w-0.5 h-10 bg-zinc-200 mx-2"></span>
                    <p className="text-sm text-zinc-600">
                      {insight.insight.who.trim() !== ""
                        ? insight.insight.who
                        : "-"}
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-between space-y-0">
                    <div className="flex px-2.5 rounded-lg bg-zinc-100 items-center gap-x-1">
                      <MapPin size={"15"} className="text-zinc-600" />
                      <p className="text-sm text-zinc-600">Where</p>
                      <span className="w-0.5 h-10 bg-zinc-200 mx-2"></span>
                      <p className="text-sm text-zinc-600">
                        {insight.insight.who.trim() !== ""
                          ? insight.insight.where
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between space-y-0">
                    <div className="flex px-2.5 rounded-lg bg-zinc-100 items-center gap-x-1">
                      <Target size={"15"} className="text-zinc-600" />
                      <p className="text-sm text-zinc-600">What</p>
                      <span className="w-0.5 h-10 bg-zinc-200 mx-2"></span>
                      <p className="text-sm text-zinc-600">
                        {insight.insight.who.trim() !== ""
                          ? insight.insight.what
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between space-y-0">
                    <div className="flex px-2.5 rounded-lg bg-zinc-100 items-center gap-x-1">
                      <LightbulbIcon size={"15"} className="text-zinc-600" />
                      <p className="text-sm text-zinc-600">Why</p>
                      <span className="w-0.5 h-10 bg-zinc-200 mx-2"></span>
                      <p className="text-sm text-zinc-600">
                        {insight.insight.who.trim() !== ""
                          ? insight.insight.why
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="justify-center items-center mt-12 pe-10">
                <p className="text-sm text-zinc-500 py-3">Hightlights</p>
                <div className="text-small text-zinc-600">
                  <ul
                    style={{ listStyleType: "inherit" }}
                    role="list"
                    className="grid grid-cols-2 gap-3"
                  >
                    {insight.insight.facts.map((item, index) => (
                      <li key={index} className="flex">
                        <p className="p-3 rounded-lg text-white bg-indigo-500">
                          {" "}
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Tabs
              defaultValue="dataRecords"
              className="space-y-0 rounded-none mt-10 flex flex-col"
            >
              <TabsList className="py-3 h-14 bg-white w-full justify-start border-b border-zinc-200 rounded-none px-8">
                <TabsTrigger
                  value="dataRecords"
                  className="bg-white data-[state=active]:bg-zinc-100 py-2"
                >
                  Records{" "}
                  <Badge variant="outline" className="bg-zinc-200/70 ms-1">
                    {insight.records.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="companies"
                  className="bg-white data-[state=active]:bg-zinc-100"
                >
                  Accounts{" "}
                  <Badge variant="outline">{insight.companies.length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="bg-white data-[state=active]:bg-zinc-100"
                >
                  Contacts{" "}
                  <Badge variant="outline">{insight.contacts.length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="bg-white data-[state=active]:bg-zinc-100"
                >
                  Activity
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dataRecords" className="">
                <Sheet modal={false} open={recordSheetOpen}>
                  <div className="flex flex-col flex-1 pb-12">
                    <div className="flex flex-col px-6">
                      <DataTable
                        columns={getRecordColumns()}
                        data={dataRecords}
                        filters={recordFilters}
                        onRowClick={handleRecordOpenSheet}
                        records={dataRecords}
                        enableRowSelection={false}
                      />
                    </div>
                  </div>
                  <SheetContent className="sm:max-w-[500px] p-0 h-dvh max-h-dvh flex flex-col overflow-hidden gap-y-0">
                    <TooltipProvider delayDuration={0}>
                      <div className="flex flex-row justify-start h-14 w-full px-3 py-2">
                        <SheetClose
                          onClick={handleRecordCloseSheet}
                          className="relative h-10 w-10 justify-center items-center rounded-lg transition-opacity hover:bg-slate-100 focus:outline-none"
                        >
                          <ChevronsRight className="h-4 w-4 mx-auto" />
                          <span className="sr-only">Close</span>
                        </SheetClose>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              target="blank"
                              href={`/records/${selectedRecordRow?.id}`}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={false}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>View fullscreen</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={false}
                              onClick={() =>
                                handleCopyRecordLink(selectedRecordRow?.id)
                              }
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share link</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>

                    <div className="flex-1 overflow-y-auto">
                      {selectedRecordRow !== null && (
                        <RecordDetails record={selectedRecordRow} />
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </TabsContent>
              <TabsContent value="companies" className="space-y-4">
                <div className="flex flex-col flex-1 pb-12">
                  <div className="flex flex-col px-6">
                    <DataTable
                      columns={fixedCompanyColumns}
                      data={companyRecords}
                      filters={companyFilters}
                      onRowClick={() => {}}
                      records={companyRecords}
                      enableRowSelection={false}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contacts" className="space-y-4">
                <div className="flex flex-col flex-1 pb-12">
                  <div className="flex flex-col px-6">
                    <DataTable
                      columns={fixedContactColumns}
                      data={contactRecords}
                      filters={contactFilters}
                      onRowClick={() => {}}
                      records={contactRecords}
                      enableRowSelection={false}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <div className="flow-root">
                  <ul role="list" className="px-8 mb-8 mt-6">
                    {timeline.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== timeline.length - 1 ? (
                            <span
                              className="absolute left-3 top-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-2">
                            <div>
                              <span className="h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white">
                                <Avatar className="h-6 w-6 rounded-lg">
                                  <AvatarImage
                                    src={insight.author.avatarUrl}
                                    alt={insight.author.name}
                                  />
                                  <AvatarFallback className="text-sm bg-slate-200">
                                    {getNameInitials(insight.author.name)}
                                  </AvatarFallback>
                                </Avatar>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
                              <div className="text-sm flex gap-x-1">
                                <p className="text-zinc-900">{event.target}</p>
                                <p className="text-zinc-500">
                                  {event.content}{" "}
                                </p>
                                <time
                                  dateTime={event.datetime}
                                  className="text-zinc-900"
                                >
                                  {event.date}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full pb-32 animate-pulse">
          <div className="flex flex-row justify-between items-center h-16 py-4 px-6">
            <div className="h-8 w-24 bg-zinc-200/60 rounded-lg"></div>
            <div className="h-8 w-52 bg-zinc-200/60 rounded-lg"></div>
            <div className="h-8 w-14 bg-zinc-200/60 rounded-lg"></div>
          </div>
          <div className="flex flex-1 bg-white rounded-lg mx-6"></div>
        </div>
      )}
    </>
  );
}
