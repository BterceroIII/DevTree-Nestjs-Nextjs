import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href='/'> 
        <Image
            src="/logo.svg"
            className="w-full block"
            alt="Logotipo"
            width={200}
            height={50}
            priority
        />
    </Link>
  )
}
