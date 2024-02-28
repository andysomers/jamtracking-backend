import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/team/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Team</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
