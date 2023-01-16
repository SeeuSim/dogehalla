import { trpc } from "utils/trpc";
import AnalyticsPage from "./[address]"
import { GetServerSidePropsContext, NextPage } from "next";
import { Suspense, useEffect, useState } from 'react';

import Head from "next/head";
import { useRouter } from "next/router";

import { ArrowRightIcon } from '@heroicons/react/24/outline';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { CollectionsRank, RankPeriod } from "@prisma/client";

//For getServerSideProps
import type { Collection } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { prisma } from "server/db/client";

import { formatFloor, formatVal } from 'utils/ethereum/price';
import LineGraph from '../../components/graphs/lineGraph';
import ImageWithFallback from "components/images/imageWithFallback";
import AnalyticsDash from "./analyticsDash";
import SocialMediaMentions from "./(analytics-components)/socialSentiments";

const Analytics: NextPage = () => {
  return (
    <>
      <Head>
        <title>NFinsighT</title>
      </Head>
      <div className="w-full">
        <AnalyticsDash/>
      </div>    
    </>
  );
};

export default Analytics;