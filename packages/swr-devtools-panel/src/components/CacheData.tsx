import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import { SWRCacheData } from "swr-devtools/lib/swr-cache";
import { CacheKey } from "./CacheKey";

type Props = {
  data: SWRCacheData;
};

export const CacheData = React.memo(({ data }: Props) => (
  <>
    <Title>
      <CacheKey cacheKey={data.key} />
      &nbsp;
      <TimestampText>{data.timestampString}</TimestampText>
    </Title>
    <DataWrapper>
      <CacheDataView data={data.data} />
      {data.error && <ErrorText>{data.error}</ErrorText>}
    </DataWrapper>
  </>
));
CacheData.displayName = "CacheData";

const DataWrapper = styled.div`
  border-bottom: solid 1px var(--swr-devtools-border-color);
  font-size: 1rem;
  height: 100%;
  margin: 0;
  padding: 0 0.3rem;
`;

const CacheDataView = ({ data }: Props) => {
  if (typeof window === "undefined") return null;
  return (
    <Suspense fallback="loading">
      <AsyncReactJson data={data} />
    </Suspense>
  );
};

const AsyncReactJson = ({ data }: Props) => {
  const ReactJson = lazy(() => import("react-json-view"));
  return (
    <ReactJson
      src={data}
      theme={
        matchMedia("(prefers-color-scheme: dark)").matches
          ? "railscasts"
          : "rjv-default"
      }
    />
  );
};

const ErrorText = styled.p`
  color: var(--swr-devtools-error-text-colora);
`;

const Title = styled.h3`
  margin: 0;
  padding: 1rem 0.5rem;
  color: var(--swr-devtools-text-color);
`;

const TimestampText = styled.span`
  font-size: 1rem;
  font-weight: normal;
`;
