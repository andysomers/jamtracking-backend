import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getTeams,
  getTeamsPath,
} from "../../../components/team/PageList";
import { PagedCollection } from "../../../types/collection";
import { Team } from "../../../types/Team";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTeamsPath(page), getTeams(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Team>>("/teams");
  const paths = await getCollectionPaths(
    response,
    "teams",
    "/teams/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
