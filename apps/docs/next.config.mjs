import { withTsGql } from "@ts-gql/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
};

export default withTsGql(nextConfig);
