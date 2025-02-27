import { DevTreeLink, UserHandleResponse } from "@/schema";
import React from "react";
import Image from "next/image";

type HandleDataProps = {
  data: UserHandleResponse;
};

export default function HandleData({ data }: HandleDataProps) {
  const links: DevTreeLink[] = JSON.parse(data.data.links).filter(
    (link: DevTreeLink) => link.enabled
  );

  return (
    <div className="space-y-6 text-white">
      <p className="text-5xl text-center font-black">{data.data.handle}</p>
      {data.data.image && (
        <Image
          src={data.data.image}
          className="max-w-[250px] mx-auto"
          alt="imagen de perfil"
        />
      )}

      <p className="text-lg text-center font-bold">{data.data.description}</p>
      <div className="mt-20 flex flex-col gap-6">
        {links.length ? (
          links.map((link) => (
            <a
              key={link.name}
              className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Image
                src={`/social/icon_${link.name}.svg`}
                alt="imagen red social"
                className="w-12"
              />
              <p className="text-black capitalize font-bold text-lg">
                Visita mi: {link.name}
              </p>
            </a>
          ))
        ) : (
          <p className="text-center">No hay enlaces en este perfil</p>
        )}
      </div>
    </div>
  );
}
