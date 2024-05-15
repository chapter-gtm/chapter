"use client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { humanDate } from "@/utils/misc";
import { getUserAccessToken } from "@/utils/supabase/client";
import {
  getIntegrations,
  getDataSources,
  addDataSource,
  getNangoHMACDigest,
} from "@/utils/nectar/integrations";
import { getUserProfile } from "@/utils/nectar/users";
import { addConnection } from "@/utils/nango/integrations";
import { type Integration, type DataSource } from "@/types/integrations";

export function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        setIntegrations(await getIntegrations(userToken));
        setDataSources(await getDataSources(userToken));
      } catch (error: any) {
        toast.error("Failed to load integrations.", {
          description: error.toString(),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleAddIntegration = async (item: Integration) => {
    try {
      const userToken = await getUserAccessToken();
      if (userToken === undefined) {
        throw Error("User needs to login!");
      }
      const connectionId = crypto.randomUUID();
      const digest: string = await getNangoHMACDigest(
        userToken,
        item.system,
        connectionId,
      );
      const connection: { providerConfigKey: string; connectionId: string } =
        await addConnection(item.system, connectionId, digest);
      await addDataSource(userToken, item, connection.connectionId);
      setDataSources(await getDataSources(userToken));
    } catch (error: any) {
      toast.error("Failed to add connection.", {
        description: error.toString(),
      });
    }
  };

  return (
    <>
      <Toaster theme="light" />
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="w-2/3 mx-auto pt-4">
          <div className="flex flex-row justify-between space-y-1 items-center h-[44px] pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-700">
              Integrations
            </h2>
          </div>

          {!isLoading ? (
            integrations.length > 0 || dataSources.length > 0 ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Manage your integrations here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-1">
                  {dataSources.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between space-x-4"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={item.integration.imageUrl}
                            alt={item.integration.system}
                          />
                          <AvatarFallback>
                            {item.integration.system}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {item.name}
                          </p>
                          {item.syncedAt ? (
                            <p className="text-sm text-muted-foreground">
                              {humanDate(new Date(item.syncedAt))}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Sync pending
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {integrations
                    .filter(
                      (item) =>
                        !dataSources.some(
                          (obj) => obj.integration.system === item.system,
                        ),
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between space-x-4"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={item.imageUrl}
                              alt={item.system}
                            />
                            <AvatarFallback>{item.system}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {item.name}
                            </p>
                            <Button
                              id={item.system}
                              onClick={() => handleAddIntegration(item)}
                            >
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ) : (
              <div></div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-4 animate-pulse">
              <div className="w-full h-44 bg-white/80 rounded-lg"></div>
              <div className="w-full h-44 bg-white/50 rounded-lg"></div>
              <div className="w-full h-44 bg-white/30 rounded-lg"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
