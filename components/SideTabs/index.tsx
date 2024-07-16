import classNames from "classnames";
import Link from "next/link";

export const Reactor: Array<ReactorTab> = [
  {
    title: "Fission",
    href: "/app/fission",
  },
  {
    title: "Fusion",
    href: "/app/fusion",
  },
  {
    title: "Transmute RSV To Gold",
    href: "/app/rsvToGold",
  },
  {
    title: "Transmute Gold to RSV",
    href: "/app/goldToRsv",
  },
];

interface ReactorTab {
  title: string;
  href: string;
}

interface SideTabProps {
  activeHref: string;
}

const ReactorSideTabs = ({ activeHref }: SideTabProps) => {
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col p-4 space-y-2 bg-darkgrey rounded-lg">
        {Reactor.map((tab) => {
          return (
            <TabButton
              key={tab.title}
              title={tab.title}
              isActive={activeHref === tab.href}
              hrefLink={tab.href}
            />
          );
        })}
      </div>
    </div>
  );
};

const TabButton = ({
  title,
  isActive,
  hrefLink,
}: {
  title: string;
  isActive: boolean;
  hrefLink: string;
}) => (
  <Link
    href={hrefLink}
    className={classNames(
      isActive
        ? "text-gluongold bg-gluongold/20 p-2 rounded-lg px-4 text-sm"
        : "text-textprimary p-2 pl-4 text-sm"
    )}
  >
    {title}
  </Link>
);

export default ReactorSideTabs;
