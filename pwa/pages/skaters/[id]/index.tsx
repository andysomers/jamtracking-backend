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

import { Show } from "../../../components/skater/Show";
import { PagedCollection } from "../../../types/collection";
import { Skater } from "../../../types/Skater";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getSkater = async (id: string | string[] | undefined) =>
  id ? await fetch<Skater>(`/skaters/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: skater, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Skater> | undefined>(["skater", id], () =>
      getSkater(id)
    );
  const skaterData = useMercure(skater, hubURL);

  if (!skaterData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Skater ${skaterData["@id"]}`}</title>
        </Head>
      </div>
      <Show skater={skaterData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["skater", id], () => getSkater(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Skater>>("/skaters");
  const paths = await getItemPaths(response, "skaters", "/skaters/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
