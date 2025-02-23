import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/layout/Home.vue";

const routes = [
    {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import(/* webpackChunkName: "login" */"../views/user/Login.vue")
    },
    {
        path: "/",
        name: "Home",
        component: Home,
        redirect: '/appList',
        children: [
            {
                path: "/appList",
                name: "AppList",
                meta: {
                    title: '标注中心'
                },
                component: () => import(/* webpackChunkName: "AppList" */"../views/task/List.vue")
            },
            {
                path: "/user",
                name: "User",
                meta: {
                    title: '账号管理'
                },
                component: () => import(/* webpackChunkName: "User" */"../views/permission/User.vue")
            },
            {
                path: "/role",
                name: "Role",
                meta: {
                    title: '角色管理'
                },
                component: () => import(/* webpackChunkName: "Role" */"../views/permission/Role.vue")
            },
            {
                path: "/group",
                name: "Group",
                meta: {
                    title: '用户组管理'
                },
                component: () => import(/* webpackChunkName: "Group" */"../views/permission/Group.vue")
            },
            {
                path: "/readme",
                name: "Readme",
                meta: {
                    title: '自述'
                },
                component: () => import(/* webpackChunkName: "Group" */"../views/about/Readme.vue")
            },
        ]

    },

    // {
    //     path: "/",
    //     name: "Home",
    //     component: Home,
    //     redirect: '/dashboard',
    //     children: [
    //         {
    //             path: "/dashboard",
    //             name: "Dashboard",
    //             meta: {
    //                 title: '系统首页'
    //             },
    //             component: () => import(/* webpackChunkName: "dashboard" */"../views/Dashboard.vue")
    //         },
    //         {
    //             path: "/table",
    //             name: "BaseTable",
    //             meta: {
    //                 title: '表格'
    //             },
    //             component: () => import(/* webpackChunkName: "table" */"../views/BaseTable.vue")
    //         },
    //         {
    //             path: "/charts",
    //             name: "BaseCharts",
    //             meta: {
    //                 title: '图表'
    //             },
    //             component: () => import(/* webpackChunkName: "charts" */"../views/BaseCharts.vue")
    //         },
    //         {
    //             path: "/form",
    //             name: "BaseForm",
    //             meta: {
    //                 title: '表单'
    //             },
    //             component: () => import(/* webpackChunkName: "form" */"../views/BaseForm.vue")
    //         },
    //         {
    //             path: "/tabs",
    //             name: "Tabs",
    //             meta: {
    //                 title: 'tab标签'
    //             },
    //             component: () => import(/* webpackChunkName: "tabs" */"../views/Tabs.vue")
    //         },
    //         {
    //             path: "/donate",
    //             name: "Donate",
    //             meta: {
    //                 title: '鼓励作者'
    //             },
    //             component: () => import(/* webpackChunkName: "donate" */"../views/Donate.vue")
    //         },
    //         {
    //             path: "/permission",
    //             name: "Permission",
    //             meta: {
    //                 title: '权限管理',
    //                 permission: true
    //             },
    //             component: () => import(/* webpackChunkName: "permission" */"../views/Permission.vue")
    //         },
    //         {
    //             path: "/i18n",
    //             name: "I18n",
    //             meta: {
    //                 title: '国际化语言'
    //             },
    //             component: () => import(/* webpackChunkName: "i18n" */"../views/I18n.vue")
    //         },
    //         {
    //             path: "/upload",
    //             name: "Upload",
    //             meta: {
    //                 title: '上传插件'
    //             },
    //             component: () => import(/* webpackChunkName: "upload" */"../views/Upload.vue")
    //         },
    //         {
    //             path: "/icon",
    //             name: "Icon",
    //             meta: {
    //                 title: '自定义图标'
    //             },
    //             component: () => import(/* webpackChunkName: "icon" */"../views/Icon.vue")
    //         },
    //         {
    //             path: '/404',
    //             name: '404',
    //             meta: {
    //                 title: '找不到页面'
    //             },
    //             component: () => import(/* webpackChunkName: "404" */'../views/404.vue')
    //         },
    //         {
    //             path: '/403',
    //             name: '403',
    //             meta: {
    //                 title: '没有权限'
    //             },
    //             component: () => import(/* webpackChunkName: "403" */'../views/403.vue')
    //         }
    //     ]
    // },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;