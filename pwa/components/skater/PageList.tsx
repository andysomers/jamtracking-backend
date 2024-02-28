import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Skater } from "../../types/Skater";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getSkatersPath = (page?: string | string[] | undefined) =>
  `/skaters${typeof page === "string" ? `?page=${page}` : ""}`;
export const getSkaters = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Skater>>(getSkatersPath(page));
const getPagePath = (path: string) =>
  `/skaters/page/${parsePage("skaters", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: skaters, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Skater>> | undefined
  >(getSkatersPath(page), getSkaters(page));
  const collection = useMercure(skaters, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Skater List</title>
        </Head>
      </div>
      <List skaters={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
