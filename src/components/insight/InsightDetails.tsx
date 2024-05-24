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
  Gem,
  ChevronLeftIcon,
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
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [recordSheetOpen, setRecordSheetOpen] = useState(false);
  const [selectedRecordRow, setSelectedRecordRow] = useState<DataRecord | null>(
    null
  );
  const [companyRecords, setCompanyRecords] = useState<CompanySchema[]>([]);
  const [contactRecords, setContactRecords] = useState<ContactSchema[]>([]);

  const currencySymbol = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Specify the currency code (e.g., USD for US Dollar, EUR for Euro)
  }).formatToParts()[0].value;

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
          })
        );

        let revenue = 0;
        ins.companies.forEach((comp: Company) => {
          revenue += comp.monthlySpend * 12;
        });
        setTotalRevenue(revenue);

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
          })
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
          })
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
        `https://${currentDomain}/records/${recordId}`
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
        <div className="h-screen pb-12 overflow-hidden flex flex-col">
          <div className="flex flex-row justify-between items-center h-16 py-4 px-6">
            <div className="flex items-center gap-2">
              <ChevronLeftIcon size={"16"} />
              <p className="text-sm font-medium text-zinc-600">
                {insight.insight.title}
              </p>
            </div>
            <Button variant="outline" size="sm" disabled={true}>
              Link
            </Button>
          </div>
          <div className="relative px-6 flex-1 overflow-y-scroll">
            <div className="rounded-lg bg-white flex grid md:grid-cols-2 lg:grid-cols-3 h-full">
              <div className="flex flex-col gap-y-4 border-e border-zinc-200 pb-10 overflow-y-auto">
                <div className="w-full justify-start space-y-2 mt-10 ps-6 pe-10 pb-10">
                  <h2 className="text-2xl font-medium tracking-tight text-zinc-600 py-2">
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

                <div className="flex flex-col text-small text-zinc-600 px-6 mb-5">
                  <ul
                    style={{ listStyleType: "inherit" }}
                    role="list"
                    className="flex flex-col gap-y-3"
                  >
                    {insight.insight.facts.map((item, index) => (
                      <li key={index} className="flex">
                        <p className="p-3 rounded-lg text-zinc-700 text-sm bg-zinc-100">
                          {" "}
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col border-t border-zinc-200 pt-3 pb-5">
                  <div className="flex flex-row justify-between items-center gap-x-1 text-xs px-6 pb-3">
                    <div className="text-sm font-medium text-zinc-800 py-2">
                      Business Value
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-x-1 px-6">
                    <div className="w-28 flex items-center gap-1 text-zinc-400">
                      <div className="w-5">
                        <Gem size={"15"} />
                      </div>
                      <p className="text-sm">ARR</p>
                    </div>
                    <div className="flex flex-1 flex-row justify-between items-center gap-x-1 text-xs">
                      <p className="text-sm text-zinc-800">
                        {currencySymbol + totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-zinc-400 ">Total seats</p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-x-1 px-6 mt-4">
                    <div className="w-28 flex items-center gap-1 text-zinc-400">
                      <div className="w-5">
                        <Gem size={"15"} />
                      </div>
                      <p className="text-sm">Potential</p>
                    </div>
                    <div className="flex flex-1 flex-row justify-between items-center gap-x-1 text-xs">
                      <p className="text-sm text-zinc-800">$50,000</p>
                      <p className="text-sm text-zinc-400 ">
                        Acccounts total seats
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col border-t border-zinc-200 pt-3 pb-5">
                  <div className="flex flex-row justify-between items-center gap-x-1 text-xs px-6 pb-3">
                    <div className="text-sm font-medium text-zinc-800 py-2">
                      Format
                    </div>

                    <Button variant="outline" size="sm" disabled={false}>
                      4w&apos;s
                      <span>
                        <ChevronDown size={"15"}></ChevronDown>
                      </span>
                    </Button>
                  </div>

                  <div className="flex flex-col justify-start px-6 gap-3 space-y-0">
                    <div className="flex flex-row items-center gap-x-1">
                      <div className="w-28 flex items-center gap-1 text-zinc-400">
                        <div className="w-5">
                          <CircleUserRound size={"15"} />
                        </div>
                        <p className="text-sm">Who</p>
                      </div>
                      <p className="text-sm text-zinc-800">
                        {insight.insight.who.trim() !== ""
                          ? insight.insight.who
                          : "-"}
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                      <div className="w-28 flex items-center gap-1 text-zinc-400">
                        <div className="w-5">
                          <MapPin size={"15"} />
                        </div>
                        <p className="text-sm">Where</p>
                      </div>

                      <p className="text-sm text-zinc-800 truncate">
                        {insight.insight.who.trim() !== ""
                          ? insight.insight.where
                          : "-"}
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                      <div className="w-28 flex items-center gap-1 text-zinc-400">
                        <div className="w-5">
                          <Target size={"15"} />
                        </div>
                        <p className="text-sm">What</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <p className="w-64 text-sm text-zinc-800 truncate">
                              {insight.insight.who.trim() !== ""
                                ? insight.insight.what
                                : "-"}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            {insight.insight.what}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                      <div className="w-28 flex items-center gap-1 text-zinc-400">
                        <div className="w-5">
                          <LightbulbIcon size={"15"} />
                        </div>
                        <p className="text-sm">Why</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <p className="w-64 text-sm text-zinc-800 truncate">
                              {insight.insight.who.trim() !== ""
                                ? insight.insight.why
                                : "-"}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>{insight.insight.why}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col border-t border-zinc-200 py-3">
                  <div className="flex flex-row justify-between items-center gap-x-1 text-xs px-6 pb-3">
                    <div className="text-sm font-medium text-zinc-800 py-2">
                      Activity
                    </div>
                  </div>
                  <div className="flow-root">
                    <ul role="list" className="px-6 mb-3">
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
                                  <p className="text-zinc-900">
                                    {event.target}
                                  </p>
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
                </div>
              </div>
              <div className="col-span-2 justify-center items-center">
                <Tabs
                  defaultValue="dataRecords"
                  className="space-y-0 rounded-none flex flex-col"
                >
                  <TabsList className="py-3 h-14 bg-transparent w-full justify-start border-b border-zinc-200 rounded-none px-3">
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
                      <Badge variant="outline">
                        {insight.companies.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="contacts"
                      className="bg-white data-[state=active]:bg-zinc-100"
                    >
                      Contacts{" "}
                      <Badge variant="outline">{insight.contacts.length}</Badge>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="dataRecords" className="">
                    <Sheet modal={false} open={recordSheetOpen}>
                      <div className="flex flex-col flex-1 pb-12">
                        <div className="flex flex-col">
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
                      <div className="flex flex-col">
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
                      <div className="flex flex-col">
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
                </Tabs>
              </div>
            </div>
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
