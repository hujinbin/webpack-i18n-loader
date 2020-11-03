<template>
    <div class="simba-header">
        <div class="header-menu-first">
            <simba-logo />
            <NavFirst
                :menu-data="menuData"
                :active="currentFirstMenu"
                @href="navFirstHref"
                style="margin-left: 100px"
            ></NavFirst>
            <div class="right-header">
                <div class="lang-wrap">
                    <sa-dropdown @command="changeLang">
                        <span class="sa-dropdown-link">
                            {{ $i18n.locale === 'en' ? '英文' : '中文' }}<i
                                class="sa-icon-arrow-down sa-icon--right"
                            ></i>
                        </span>
                        <sa-dropdown-menu slot="dropdown">
                            <sa-dropdown-item
                                command="zh"
                            >
                                中文
                            </sa-dropdown-item>
                            <sa-dropdown-item
                                command="en"
                            >
                                英文
                            </sa-dropdown-item>
                        </sa-dropdown-menu>
                    </sa-dropdown>
                </div>
                <UserWrap @quit="loginOut" />
            </div>
        </div>
        <div
            class="header-menu-second"
            v-if="
                [
                    'integrate',
                    'dev',
                    'ops',
                    'service',
                    'assets',
                ].indexOf(currentFirstMenu) > -1
            "
        >
            <NavSecond
                :menu-data="currentSecondMenuList"
                :active="currentSecondMenu"
                :is-show-project-center="
                    ['integrate', 'dev', 'ops'].indexOf(
                        currentFirstMenu,
                    ) > -1
                "
                :is-show-release-manage="isShowReleaseManage"
            >
                <project-cascade
                    v-if="
                        ['integrate', 'dev', 'ops'].indexOf(
                            currentFirstMenu,
                        ) > -1
                    "
                    :beforunload-callback="beforunloadCallback"
                />
            </NavSecond>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import UserWrap from '@/modules/User/views/UserWrap';
import ProjectCascade from './components/ProjectCascade';
import SimbaLogo from './components/SimbaLogo.vue';
import NavFirst from './components/NavFirst';
import NavSecond from './components/NavSecond';

const disabledRulesByProject = {
    integrate: {
        offline: ['onlineDataSync'],
        online: ['offlineDataSync'],
    },
    dev: {
        offline: ['devApis', 'onlineDataDev', 'algCenter'],
        online: [
            'dataModel',
            'devApis',
            'offlineDataDev',
            'tagFactory',
            'algCenter',
        ],
        algorithm: [
            'dataModel',
            'offlineDataDev',
            'onlineDataDev',
            'tagFactory',
            'devApis',
        ],
        api: [
            'dataModel',
            'offlineDataDev',
            'onlineDataDev',
            'algCenter',
            'tagFactory',
            'dataDev',
        ],
    },
    ops: {
        offline: ['onlineOps', 'opsCenter', 'apiOps'],
        online: [
            'offlineOps',
            'opsCenter',
            'apiOps',
            'dataQuality',
            'release',
        ],
        algorithm: [
            'onlineOps',
            'offlineOps',
            'apiOps',
            'dataQuality',
            'release',
        ],
        api: [
            'onlineOps',
            'offlineOps',
            'opsCenter',
            'dataQuality',
            'release',
        ],
    },
};

export default {
    name: 'GlobalHeader',

    components: {
        UserWrap,
        SimbaLogo,
        NavFirst,
        NavSecond,
        ProjectCascade,
    },

    data() {
        return {
            menuData: [
                {
                    label: '集成',
                    name: 'integrate',
                    children: [
                        {
                            isGroup: true,
                            groupLabel: '数据同步',
                            name: 'dataSync',
                            list: [
                                {
                                    label: '离线开发',
                                    name: 'offlineDataSync',
                                },
                                {
                                    label: '实时开发',
                                    name: 'onlineDataSync',
                                },
                            ],
                        },
                    ],
                },
                {
                    label: '研发',
                    name: 'dev',
                    children: [
                        {
                            label: '规范建模',
                            name: 'dataModel',
                        },
                        {
                            isGroup: true,
                            groupLabel: '数据开发',
                            name: 'dataDev',
                            list: [
                                {
                                    label: '离线开发',
                                    name: 'offlineDataDev',
                                },
                                {
                                    label: '实时开发',
                                    name: 'onlineDataDev',
                                },
                                {
                                    label: '算法开发',
                                    name: 'algCenter',
                                },
                            ],
                        },
                        {
                            label: '标签工厂',
                            name: 'tagFactory',
                        },
                        {
                            label: 'API开发',
                            name: 'devApis',
                        },
                    ],
                },
                {
                    label: '运维',
                    name: 'ops',
                    children: [
                        {
                            label: '发布管理',
                            name: 'release',
                        },
                        {
                            isGroup: true,
                            groupLabel: '数据生产',
                            name: 'dataOps',
                            list: [
                                {
                                    label: '离线运维',
                                    name: 'offlineOps',
                                },
                                {
                                    label: '实时运维',
                                    name: 'onlineOps',
                                },
                                {
                                    label: '算法运维',
                                    name: 'opsCenter',
                                },
                            ],
                        },
                        {
                            label: 'API监控',
                            name: 'apiOps',
                        },
                        {
                            label: '数据质量',
                            name: 'dataQuality',
                        },
                    ],
                },
                {
                    label: '服务',
                    name: 'service',
                    children: [
                        {
                            label: 'API市场',
                            name: 'apiMarket',
                        },
                        {
                            label: '数据订阅',
                            name: 'dataSub',
                        },
                    ],
                },
                {
                    label: '资产',
                    name: 'assets',
                    children: [
                        {
                            label: '概览',
                            name: 'assetsOverview',
                        },
                        {
                            label: '数据地图',
                            name: 'dataMap',
                        },
                        {
                            label: '资产分布',
                            name: 'assetsPart',
                        },
                    ],
                },
                {
                    label: '配置',
                    name: 'config',
                },
            ],
            currentFirstMenu: '',
            currentSecondMenu: '',
            currentSecondMenuList: [],
            // title: '',
        };
    },
    computed: {
        ...mapState('user', ['mapCode']),
        ...mapState('global', [
            'currentProjectId',
            'currentPlateId',
        ]),
        ...mapGetters('global', [
            'computedProjectType',
            'isStandardMode',
        ]),
        isShowReleaseManage() {
            return (
                this.isStandardMode &&
                [
                    'offlineDataSync',
                    'onlineDataSync',
                    'offlineDataDev',
                    'onlineDataDev',
                    'algCenter',
                ].indexOf(this.currentSecondMenu) > -1
            );
        },
    },
    watch: {
        $route() {
            this.getCurrentMenuNameFromRoute();
        },
        currentFirstMenu() {
            this.currentSecondMenuList = (
                this.menuData.find(
                    item => item.name === this.currentFirstMenu,
                ) || {}
            ).children;
            this.disabledMenuData();
            this.hideMenuData();
        },
        currentProjectId() {
            this.disabledMenuData();
            this.hideMenuData();
        },
    },
    created() {},
    methods: {
        beforunloadCallback(event) {
            const isLoginOut = this.$route.path === '/userLogin';

            if (isLoginOut) {
                event.preventDefault();
                return;
            }

            event = event || window.event;

            if (event) {
                event.returnValue = '系统可能不会保存你的修改';
            }

            return '系统可能不会保存你的修改';
        },

        async loginOut() {
            window.removeEventListener(
                'beforeunload',
                this.beforunloadCallback,
            );

            const response = await this.fetchLoginout();

            if (response.success) {
                window.localStorage.clear();
                window.sessionStorage.clear();

                this.$router.replace('/userLogin');
            }
        },

        init() {
            // 离线、实时开发环境
            if (
                [
                    'offlineDataSync',
                    'onlineDataSync',
                    'offlineDataDev',
                    'onlineDataDev',
                    'dataApisDev',
                ].includes(this.$route.name)
            ) {
                window.addEventListener(
                    'beforeunload',
                    this.beforunloadCallback,
                );
            }
        },

        ...mapActions('user', ['fetchLoginout']),

        ...mapActions('option/dataSourceManagement', [
            'fetchListDataSourcesTypes',
        ]),

        // 根据路由获取当前命中的菜单
        getCurrentMenuNameFromRoute() {
            this.currentFirstMenu = '';
            this.currentSecondMenu = '';
            const { matched } = this.$route;
            const currentMenuMap = matched.reduce((re, route) => {
                if (route.name) {
                    re[route.name] = true;
                }
                return re;
            }, {});
            this.loopMenuData((name, level) => {
                // console.log(`name: ${name} |  level: ${level}`);
                if (currentMenuMap[name]) {
                    if (level === 1) {
                        this.currentFirstMenu = name;
                    } else {
                        this.currentSecondMenu = name;
                    }
                }
            });
        },

        loopMenuData(cb) {
            function loop(list, level) {
                list.forEach(item => {
                    cb(item.name, level, item);
                    if (item.children && item.children.length > 0) {
                        loop(item.children, level + 1);
                    }
                    if (item.isGroup && item.list.length > 0) {
                        loop(item.list, level);
                    }
                });
            }
            loop(this.menuData, 1);
        },

        // 一级菜单跳转
        navFirstHref(name) {
            // todo 临时权限判断
            if (
                name === 'assets' &&
                !this.mapCode['dataInventory']
            ) {
                name = 'dataMap';
            }
            if (name === 'config' && !this.mapCode['rm']) {
                name = 'plan';
            }
            this.$router.push({ name });
        },
        // 设置当前二级菜单的 disabled
        disabledMenuData() {
            let finded = false;
            this.loopMenuData((name, level, item) => {
                if (level === 1) {
                    if (name === this.currentFirstMenu) {
                        finded = true;
                    } else {
                        finded = false;
                    }
                } else if (finded) {
                    // level === 2 && 命中一级菜单
                    const disabledList =
                        (disabledRulesByProject[
                            this.currentFirstMenu
                        ] || {})[this.computedProjectType] || [];
                    // 离线开发 部分项目不能规范建模
                    if (
                        this.currentFirstMenu === 'dev' &&
                        this.computedProjectType === 'offline' &&
                        !this.currentPlateId
                    ) {
                        disabledList.push('dataModel', 'tagFactory');
                    }
                    // 数据资产权限过滤
                    if (!this.mapCode['dataInventory']) {
                        disabledList.push(
                            'assetsOverview',
                            'assetsPart',
                        );
                    }

                    item.disabled = disabledList.indexOf(name) > -1;
                }
            });
        },
        hideMenuData() {
            // 标准模式的项目才显示 发布管理
            if (!this.isStandardMode) {
                const child = this.menuData.find(
                    item => item.name === 'ops',
                ).children;
                const index = child.findIndex(
                    item => item.name === 'release',
                );
                if (index > -1) {
                    child.splice(index, 1);
                }
            }
            // 标准模式没有标签工厂
            if (this.isStandardMode) {
                const child = this.menuData.find(
                    item => item.name === 'dev',
                ).children;
                const index = child.findIndex(
                    item => item.name === 'tagFactory',
                );
                if (index > -1) {
                    child.splice(index, 1);
                }
            }
        },
        // 语言切换
        changeLang(val) {
            console.log(val);
            const locale = localStorage.getItem('locale');
            console.log(locale);
            localStorage.setItem('locale', val);
            this.$i18n.locale = val;
            console.log(this.$i18n);
            console.log(this.$i18n.locale);
            console.log(locale);
            if (val !== locale) {
                window.location.reload();
            }
        },
    },

    mounted() {
        this.fetchListDataSourcesTypes();
        this.getCurrentMenuNameFromRoute();
    },

    destroyed() {
        window.removeEventListener(
            'beforeunload',
            this.beforunloadCallback,
        );
    },
};
</script>

<style lang="less" scoped>
@import '~@/assets/css/fn.less';
.fn() {
  .header-menu-first {
    padding: 0 20px;
    // color: @--color-text-primary;
    color: #fff;
    display: flex;
    align-items: center;
  }

  .right-header {
    flex: 1;
    text-align: right;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    .lang-wrap{
      padding: 5px 10px;
      /deep/ .sa-dropdown{
        color: @--color-text-secondary;
      }
    }
    .header-setting {
      @{deep} .datasimba-icon {
        position: relative;
        top: 3px;
      }
    }
  }
}
</style>
