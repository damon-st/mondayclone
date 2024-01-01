import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="logo">
      <Image
        className="logo-img"
        width={50}
        height={50}
        src="/logo.png"
        alt="logo.png"
      />
      <h2 className="logo-title">myday</h2>
    </Link>
  );
};
