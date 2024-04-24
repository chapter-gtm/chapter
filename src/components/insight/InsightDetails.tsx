"use client";
import { useEffect, useState } from "react";
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
  const [tableRecords, setTableRecords] = useState<RecordSchema[]>([]);
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
        setTableRecords(tableRecs);

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

  return (
    <>
      {insight !== null ? (
        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {insight.insight.statement}
                </h2>
              </div>
              <p>
                Drafted by Nectar, commissioned by
                <Avatar className="mr-2 h-5 w-5 rounded-lg">
                  <AvatarImage
                    src={insight.author.avatarUrl}
                    alt={insight.author.name}
                  />
                  <AvatarFallback className="text-xs bg-slate-200">
                    {getNameInitials(insight.author.name)}
                  </AvatarFallback>
                </Avatar>
                {insight.author.name}
                {" at "}
                {humanDate(new Date(insight.createdAt), true)}
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Who</CardTitle>
                    <Users />
                  </CardHeader>
                  <CardContent>
                    <div className="text-l font-bold">
                      {insight.insight.who.trim() !== ""
                        ? insight.insight.who
                        : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      User type, including segment or specification
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Where</CardTitle>
                    <MapPin />
                  </CardHeader>
                  <CardContent>
                    <div className="text-l font-bold">
                      {insight.insight.where.trim() !== ""
                        ? insight.insight.where
                        : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cities, countries, regions, that insight is based on
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">What</CardTitle>
                    <Target />
                  </CardHeader>
                  <CardContent>
                    <div className="text-l font-bold">
                      {insight.insight.what.trim() !== ""
                        ? insight.insight.what
                        : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A notable behavior, occurrence, or situation
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Why</CardTitle>
                    <ShieldQuestion />
                  </CardHeader>
                  <CardContent>
                    <div className="text-l font-bold">
                      {insight.insight.why.trim() !== ""
                        ? insight.insight.why
                        : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      An explanation of the behavior or occurrence
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facts</CardTitle>
                <Quote />
              </CardHeader>
              <CardContent>
                <div className="text-l">
                  <ul style={{ listStyleType: "disc" }}>
                    {insight.insight.facts.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground">
                  Data points, user quotes, anecdotes, observations that support
                  the insight
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="records" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tableRecords">
                Records{" "}
                <Badge variant="outline">{insight.records.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="companies">
                Accounts{" "}
                <Badge variant="outline">{insight.companies.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="contacts">
                Contacts{" "}
                <Badge variant="outline">{insight.contacts.length}</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tableRecords" className="space-y-4">
              <Sheet modal={false} open={recordSheetOpen}>
                <div className="flex flex-col flex-1 pb-12">
                  <div className="flex flex-col pb-4 bg-white border border-zinc-200 rounded-lg">
                    <DataTable
                      columns={getRecordColumns()}
                      data={tableRecords}
                      filters={recordFilters}
                      onRowClick={handleRecordOpenSheet}
                      records={tableRecords}
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
                <div className="flex flex-col pb-4 bg-white border border-zinc-200 rounded-lg">
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
                <div className="flex flex-col pb-4 bg-white border border-zinc-200 rounded-lg">
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
