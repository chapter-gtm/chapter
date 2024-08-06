import { toTitleCase } from "@/utils/misc";
import { OpportunityStage } from "@/types/opportunity";
import { getOpportunities } from "@/utils/chapter/opportunity";
import { getUserAccessToken } from "@/utils/supabase/client";

export async function getColumns() {
    let stages: Column[] = [];
    for (let stage in OpportunityStage) {
        const value = OpportunityStage[stage as keyof typeof OpportunityStage];
        stages.push({ id: value, title: toTitleCase(stage) });
    }
    return stages;
}

export async function getRecords() {
    const userToken = await getUserAccessToken();
    if (userToken === undefined) {
        throw Error("User needs to login!");
    }
    return await getOpportunities(userToken);
}
