// 'use client';

// import * as React from 'react';
// import { categories } from './CategorySidebar';
// import { ChevronRight } from 'lucide-react';

// type CategoryHeaderProps = {
//   categoryId: number | null;
//   subCategoryId: number | null;
//   onSubCategorySelect: (subCategoryId: number) => void;
// };

// export function CategoryHeader({
//   categoryId,
//   subCategoryId,
//   onSubCategorySelect,
// }: CategoryHeaderProps) {
//   const category = categories.find((c) => c.id === categoryId);
//   const subCategory = category?.subCategories?.find(
//     (sc) => sc.id === subCategoryId
//   );

//   if (!category) return null;

//   return (
//     <div className='p-4 border-b'>
//       <div className='flex items-center gap-2 mb-2'>
//         <span className='font-semibold'>{category.name}</span>
//         {subCategory && (
//           <>
//             <ChevronRight className='w-4 h-4' />
//             <span>{subCategory.name}</span>
//           </>
//         )}
//       </div>
//       <div className='flex gap-2 overflow-x-auto'>
//         {category.subCategories?.map((subCat) => (
//           <button
//             key={subCat.id}
//             className={`px-3 py-1 text-sm rounded-full ${
//               subCategoryId === subCat.id
//                 ? 'bg-primary text-primary-foreground'
//                 : 'bg-secondary'
//             }`}
//             onClick={() => onSubCategorySelect(subCat.id)}
//           >
//             {subCat.name}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
