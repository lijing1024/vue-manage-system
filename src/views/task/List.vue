<template>
	<div>
		<!-- <div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i> 基础表格
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div> -->
		<div class="container">
			<div class="handle-box">
				<el-input
					v-model="query.name"
					placeholder="筛选关键字"
					class="handle-input mr10"
				></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch"
					>搜索</el-button
				>
				<el-button style="float: right" type="primary" @click="handleAdd"
					>新建app任务</el-button
				>
			</div>
			<el-table
				:data="tableData"
				border
				class="table"
				ref="multipleTable"
				header-cell-class-name="table-header"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="name" label="任务名称" width="180"> </el-table-column>
				<el-table-column prop="user_name" label="发布人"> </el-table-column>
				<el-table-column prop="push_time" label="周期"> </el-table-column>
				<el-table-column prop="app_package" label="app包" width="180"> </el-table-column>
				<el-table-column label="任务状态" align="center">
					<template #default="scope">
						<el-tag
							:type="
								scope.row.state === '成功'
									? 'success'
									: scope.row.state === '失败'
									? 'danger'
									: ''
							"
							>{{ scope.row.state }}</el-tag
						>
					</template>
				</el-table-column>
				<el-table-column prop="task" label="标注人员" width="100"></el-table-column>
				<el-table-column prop="update_time" label="最新调度" sortable width="220">
				</el-table-column>
				<el-table-column label="操作" width="200" fixed="right">
					<template #default="scope">
						<el-row>
							<el-col :span="8">
								<el-tooltip content="编辑" placement="top">
									<el-button
										type="primary"
										@click="handleEdit(scope.row)"
										icon="el-icon-edit"
										size="mini"
										round
									/>
								</el-tooltip>
							</el-col>
							<el-col :span="8">
								<el-tooltip content="删除" placement="top">
									<el-button
										type="danger"
										icon="el-icon-delete"
										round
										size="mini"
										@click="handleDelete(scope.$index, scope.row)"
									/>
								</el-tooltip>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.current"
					:page-size="query.pageSize"
					:total="total"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>

		<!-- 新建/编辑弹出框 -->
		<el-dialog :title="isEdit ? '编辑任务' : '新建任务'" v-model="editVisible" width="80%">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="任务名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="任务描述">
					<el-input type="textarea" v-model="form.desc"></el-input>
				</el-form-item>
				<el-form-item label="app名称">
					<el-input v-model="form.app_name"></el-input>
				</el-form-item>
				<el-form-item label="app包上传">
					<el-upload
						action="https://jsonplaceholder.typicode.com/posts/"
						:on-preview="handlePreview"
						:on-remove="handleRemove"
						:before-remove="beforeRemove"
						:file-list="fileList"
					>
						<el-button size="small" type="primary">点击上传</el-button>
						<template #tip>
							<div class="el-upload__tip">只能上传 .apk 文件</div>
						</template>
					</el-upload>
				</el-form-item>
				<el-form-item label="版本号">
					<el-input v-model="form.version"></el-input>
				</el-form-item>
				<el-form-item label="包名">
					<el-input v-model="form.package"></el-input>
				</el-form-item>
				<el-form-item label="数据优先级">
					<el-select v-model="form.prio" placeholder="请选择">
						<el-option
							v-for="item in options_prio"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							:disabled="item.disabled"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="推送周期">
					<el-select v-model="form.push_time" placeholder="请选择">
						<el-option
							v-for="item in options_push_time"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							:disabled="item.disabled"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标注人员">
					<el-select v-model="form.signer" placeholder="请选择">
						<el-option
							v-for="item in options_push_time"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							:disabled="item.disabled"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import { fetchData } from '@/api/index';
	import { options_prio, options_push_time } from '@/utils/constant.js';
	export default {
		data() {
			return {
				query: {
					name: '',
					current: 1,
					pageSize: 10,
				},
				total: 0,
				tableData: [],
				form: {
					name: '',
					desc: '',
					app_name: '',
					apk: '',
					version: '',
					package: '',
					prio: '',
					push_time: '',
					signer: '',
				},
				multipleSelection: [],
				isEdit: false,
				editVisible: false,
				fileList: [],
				id: -1,
				options_prio,
				options_push_time,
			};
		},
		mounted() {
			this.getData();
		},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			beforeRemove(file, fileList) {
				console.log('fileList', fileList);
				return this.$confirm(`确定移除 ${file.name}？`);
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				fetchData(this.query).then((res) => {
					console.log(res);
					this.tableData = res.list;
					this.total = res.total;
				});
			},
			// 新增
			handleAdd() {
				this.editVisible = true;
				this.form = {};
			},
			// 搜索
			handleSearch() {
				this.query.current = 1;
				this.getData();
			},
			// 删除操作
			handleDelete(index) {
				// 二次确认删除
				this.$confirm('确定要删除吗？', '提示', {
					type: 'warning',
				})
					.then(() => {
						this.$message.success('删除成功');
						this.tableData.splice(index, 1);
					})
					.catch(() => {});
			},
			// 多选操作
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 编辑操作
			handleEdit(row) {
				this.isEdit = true;
				this.form = row;
				this.editVisible = true;
			},
			// 保存编辑
			saveEdit() {
				this.editVisible = false;
			},
			// 分页导航
			handlePageChange(val) {
				this.query.current = val;
				this.getData();
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
	.table {
		width: 100%;
		font-size: 14px;
	}
	.red {
		color: #ff0000;
	}
	.mr10 {
		margin-right: 10px;
	}
	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}
</style>
