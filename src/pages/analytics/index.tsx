import Head from "next/head";
import Link from "next/link";
import { NextApiRequest, NextApiResponse } from "next";
import Banner from "./(analytics-components)/banner"
import FeatureDropdown from "./(analytics-components)/featureDropdown"

import { getSession } from "server/auth/session";
import InternalDashboard from "./argon-dashboard-tailwind-main/build/internalDashboard";
import Dashboard from "./(analytics-components)/dashboard"
/**
 * More work is needed for this UI
 */
export default function Analytics() {
  return (
    <>
    <Dashboard></Dashboard>
    <div>
    </div>
  </>
  )
}
