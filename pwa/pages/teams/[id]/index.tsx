import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/team/Show";
import { PagedCollection } from "../../../types/collection";
import { Team } from "../../../types/Team";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getTeam = async (id: string | string[] | undefined) =>
  id ? await fetch<Team>(`/teams/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: team, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Team> | undefined>(["team", id], () => getTeam(id));
  const teamData = useMercure(team, hubURL);

  if (!teamData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Team ${teamData["@id"]}`}</title>
        </Head>
      </div>
      <Show team={teamData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["team", id], () => getTeam(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Team>>("/teams");
  const paths = await getItemPaths(response, "teams", "/teams/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
