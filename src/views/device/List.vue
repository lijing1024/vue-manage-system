<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item
					><i class="el-icon-menu" />
					<router-link :to="'app_item'">监控中心 </router-link>
				</el-breadcrumb-item>
				<el-breadcrumb-item>设备监控</el-breadcrumb-item>
				<el-breadcrumb-item
					><i class="el-icon-view" /> {{ this.project_name }}</el-breadcrumb-item
				>
			</el-breadcrumb>
		</div>

		<el-table
			:data="tableData.slice((cur_page - 1) * pagesize, cur_page * pagesize)"
			border
			style="width: 100%"
			ref="multipleTable"
		>
			<el-table-column label="设备" width="50">
				<i class="el-icon-mobile-phone" />
			</el-table-column>
			<el-table-column prop="device_id" label="设备ID" width="120"> </el-table-column>
			<el-table-column prop="device_type" label="设备类型" width="120"> </el-table-column>
			<el-table-column prop="ip" label="IP" width="150"> </el-table-column>
			<el-table-column prop="state" label="设备状态" sortable width="120"> </el-table-column>
			<el-table-column prop="running_time" label="在执行任务运行时常" sortable width="180">
			</el-table-column>
			<el-table-column label="设备已安装app包名" sortable width="180">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" placement="top-start">
						<div slot="content">{{ scope.row.packages_list }}</div>
						<el-button>已安装包名</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination
				:page-size="pagesize"
				@current-change="handleCurrentChange"
				layout="prev, pager, next"
				:total="tableLenght"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				url: '/local/submit_record',
				tableData: [],
				pagesize: 50,
				tableLenght: 1,
				cur_page: 1,
				multipleSelection: [],
				select_cate: '',
				select_word: '',
				del_list: [],
				project_id: '',
				project_name: '',
				is_search: false,
				radio: '1',
				show_new: false,
				form_edit: false,
				admin_user: ['董禹龙', '苏卫宁', '夏盛瑜', 'xiezhiyong'],
			};
		},
		created() {
			this.login_user();
			this.getData();
		},
		computed: {
			data() {
				const self = this;
				return self.data;
			},
		},
		methods: {
			login_user() {
				const self = this;
				var username = localStorage.getItem('ms_username');
				for (let i = 0; i < self.admin_user.length; i++) {
					if (self.admin_user[i] === username) {
						self.options_prio[1].disabled = false;
						self.options_prio[2].disabled = false;
						self.options_prio[3].disabled = false;
					}
				}
			},
			show_table() {
				// eslint-disable-next-line no-unused-vars
				let self = this;
			},
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},

			getData() {
				let self = this;
				if (process.env.NODE_ENV === 'development') {
					self.url = '/local/devices_info_get';
				}
				self.$axios.get(self.url).then((res) => {
					console.log(res.data.res);
					if (res.data.res.length >= 1) {
						self.tableLenght = res.data.res.length;
					}
					self.tableData = res.data.res;
				});
			},
			search() {
				this.is_search = true;
			},
			form_data() {
				// eslint-disable-next-line no-unused-vars
				let self = this.from1;
			},
			EditItem(row) {
				let routeData = 'http://192.168.0.100:17310/index/' + row.id;
				window.open(routeData, '_blank');
			},
			UpdateItemChange() {
				let self = this;
				let url = '/local/submit_edit';
				self.form2.sub_time = Date.parse(new Date()) / 1000;
				self.$axios.get(url, { params: { form: self.form2 } }).then((res) => {
					if (res.data.error === 0) {
						this.$notify({
							message: '修改数据成功！',
							type: 'success',
							duration: '3000',
						});
						this.form_edit = false;
						let url = '/local/submit_record';
						self.getData();
					} else if (res.data.error === -2) {
						this.$notify({
							message: '任务名不能为空',
							type: 'error',
							duration: '1000',
						});
					} else {
						this.$notify({
							message: '修改任务失败！',
							type: 'error',
							duration: '1000',
						});
					}
				});
			},
			delAll() {
				const self = this,
					length = self.multipleSelection.length;
				let str = '';
				self.del_list = self.del_list.concat(self.multipleSelection);
				for (let i = 0; i < length; i++) {
					str += self.multipleSelection[i].name + ' ';
				}
				self.$notify({
					message: '删除了' + str,
					type: 'success',
					duration: '3000',
				});
				self.multipleSelection = [];
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			pic_dump(from_source) {
				// 获取时间
				console.log(from_source);
				let date = new Date();
				let nowMonth = date.getMonth() + 1;
				let strDate = date.getDate() - 1;
				let seperator = '-';
				if (nowMonth >= 1 && nowMonth <= 9) {
					nowMonth = '0' + nowMonth;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = '0' + strDate;
				}
				let nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;

				let tar_link =
					'http://ds41.se.zzzc.qihoo.net:11111/spider_funnel/static_hour/index.php?info=' +
					from_source +
					'&data=' +
					nowDate;
				window.location.href = tar_link;
			},
		},
	};
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}
	.handle-select {
		width: 120px;
	}
	.handle-input {
		width: 300px;
		display: inline-block;
	}
</style>
