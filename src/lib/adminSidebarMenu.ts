import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW, ADMIN_COUPON_ADD, ADMIN_COUPON_SHOW, ADMIN_CUSTOMERS_SHOW, ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIENT_ADD, ADMIN_PRODUCT_VARIENT_SHOW, ADMIN_REVIEW_SHOW } from "@/AdminPanelRoutes";

export const adminAppSidebarMenu = [
    {
        title: 'Dashboard',
        icon: AiOutlineDashboard,
        url: ADMIN_DASHBOARD
    },
    {
        title: 'Category',
        icon: BiCategory,
        url: '#',
        submenu: [
            {
                title: 'Add Category',
                url: ADMIN_CATEGORY_ADD
            },
            {
                title: 'All Categories',
                url: ADMIN_CATEGORY_SHOW
            }
        ]
    },
    {
        title : 'Product',
        url : '#',
        icon : IoShirtOutline,
        submenu : [
            {
                title: 'Add Product',
                url: ADMIN_PRODUCT_ADD
            },
            {
                title: 'Add Varient',
                url: ADMIN_PRODUCT_VARIENT_ADD
            },
            {
                title: 'All Products',
                url: ADMIN_PRODUCT_SHOW
            },
            {
                title: 'Product Varients',
                url: ADMIN_PRODUCT_VARIENT_SHOW
            }
        ]
    },
    {
        title: 'Coupons',
        icon: RiCoupon2Line,
        url: '#',
        submenu: [
            {
                title: 'Add Coupons',
                url: ADMIN_COUPON_ADD
            },
            {
                title: 'All Coupons',
                url: ADMIN_COUPON_SHOW
            }
        ]
    },
     {
        title: 'Orders',
        icon: MdOutlineShoppingBag,
        url: '#'
    },
     {
        title: 'Customers',
        icon: LuUserRound,
        url: ADMIN_CUSTOMERS_SHOW
    },
     {
        title: 'Rating and Reviews',
        icon: IoMdStarOutline,
        url: ADMIN_REVIEW_SHOW
    },
     {
        title: 'Media',
        icon: MdOutlinePermMedia,
        url: ADMIN_MEDIA_SHOW
    },

]