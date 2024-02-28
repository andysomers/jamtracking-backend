import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/skater/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Skater</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
