import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getSkaters,
  getSkatersPath,
} from "../../../components/skater/PageList";
import { PagedCollection } from "../../../types/collection";
import { Skater } from "../../../types/Skater";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getSkatersPath(page), getSkaters(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Skater>>("/skaters");
  const paths = await getCollectionPaths(
    response,
    "skaters",
    "/skaters/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
