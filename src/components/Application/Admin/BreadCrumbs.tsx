import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbItemType {
  href: string;
  label: string;
}

interface BreadCrumbsProps {
  breadcrumbData: BreadcrumbItemType[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ breadcrumbData }) => {
  return (
    <div>
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          {breadcrumbData.length > 0 && breadcrumbData.map((data, index) => {
            return (
              index !== breadcrumbData.length - 1
                ?
                <div key={index} className="flex items-center">
                  <BreadcrumbItem>
                    <BreadcrumbLink href={data.href}>{data.label}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="ms-2" />
                </div>
                :
                <div key={index} className="flex items-center">
                  <BreadcrumbItem>
                    <BreadcrumbLink href={data.href}>{data.label}</BreadcrumbLink>
                  </BreadcrumbItem>
                </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumbs;



//   {breadcrumbData.map((item, index) => (
//             <React.Fragment key={index}>
//               <BreadcrumbItem>
//                 {index === breadcrumbData.length - 1 ? (
//                   <BreadcrumbPage>{item.label}</BreadcrumbPage>
//                 ) : (
//                   <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
//                 )}
//               </BreadcrumbItem>
//               {index < breadcrumbData.length - 1 && <BreadcrumbSeparator />}
//             </React.Fragment>
//           ))}