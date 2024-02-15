import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Survey } from "@/types/survey";

const results = [
  {
    id: "1234",
    date: "2024-02-14T10:00:30.123456Z",
    email: "bob@example.com",
    stage: "COMPLETED",
    sentiment: "4",
  },
];

interface SurveyResultsProps {
  survey: Survey | null;
}

export function SurveyResults({ survey }: SurveyResultsProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Survey Results
          </h2>
          <p className="text-sm text-muted-foreground">Your survey results.</p>
        </div>
      </div>
      <Separator className="my-4" />
      <Table>
        <TableCaption>Survey Results</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Email</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="text-right">Sentiment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.date}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.stage}</TableCell>
              <TableCell className="text-right">
                {submission.sentiment}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
