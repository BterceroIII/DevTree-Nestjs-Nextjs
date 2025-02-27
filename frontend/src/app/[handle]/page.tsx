"use client"

import { getUserByHandle } from '@/api/auth';
import HandleData from '@/components/HandleData';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react'

export default function HandleViewPage({ params }: { params: { handle: string } }) {
  const { handle } = params; // directamente desde params
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["userByHandle", handle],
    queryFn: () => getUserByHandle(handle),
  });

  if (isLoading)
    return <p className="text-center text-white">Cargando...</p>;

  if (error) {
    router.push("/404");
    return null;
  }

  if (data) return <HandleData data={data} />;

  return null;
}
