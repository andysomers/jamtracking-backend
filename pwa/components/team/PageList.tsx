import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Team } from "../../types/Team";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getTeamsPath = (page?: string | string[] | undefined) =>
  `/teams${typeof page === "string" ? `?page=${page}` : ""}`;
export const getTeams = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Team>>(getTeamsPath(page));
const getPagePath = (path: string) => `/teams/page/${parsePage("teams", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: teams, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Team>> | undefined
  >(getTeamsPath(page), getTeams(page));
  const collection = useMercure(teams, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Team List</title>
        </Head>
      </div>
      <List teams={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
