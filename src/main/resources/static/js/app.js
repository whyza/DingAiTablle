class DatasourceApp {
    constructor() {
        this.config = {
            serviceUrl: 'http://localhost:8080',
            dataSourceId: 'test_datasource',
            dataSourceName: '测试数据源',
            description: ''
        };
        this.currentSheet = null;
        this.currentPage = 1;
        this.pageSize = 20;
        this.sheets = [];
        
        this.init();
    }

    init() {
        this.loadConfig();
        this.bindEvents();
    }

    loadConfig() {
        const savedConfig = localStorage.getItem('datasourceConfig');
        if (savedConfig) {
            this.config = JSON.parse(savedConfig);
            this.fillForm();
        }
    }

    saveConfig() {
        localStorage.setItem('datasourceConfig', JSON.stringify(this.config));
    }

    fillForm() {
        document.getElementById('serviceUrl').value = this.config.serviceUrl;
        document.getElementById('dataSourceId').value = this.config.dataSourceId;
        document.getElementById('dataSourceName').value = this.config.dataSourceName;
        document.getElementById('description').value = this.config.description;
    }

    bindEvents() {
        this.bindTabEvents();
        this.bindFormEvents();
        this.bindSheetEvents();
        this.bindRecordEvents();
    }

    bindTabEvents() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }

    bindFormEvents() {
        const form = document.getElementById('datasourceForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveConfig();
        });

        document.getElementById('testConnection').addEventListener('click', () => {
            this.testConnection();
        });
    }

    async handleSaveConfig() {
        this.config.serviceUrl = document.getElementById('serviceUrl').value;
        this.config.dataSourceId = document.getElementById('dataSourceId').value;
        this.config.dataSourceName = document.getElementById('dataSourceName').value;
        this.config.description = document.getElementById('description').value;
        
        this.saveConfig();
        this.showResult('配置保存成功！', 'success');
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.config.serviceUrl}/api/health`);
            const data = await response.json();
            
            if (data.code === 0) {
                this.showResult('连接成功！服务运行正常', 'success');
            } else {
                this.showResult('连接失败：' + data.message, 'error');
            }
        } catch (error) {
            this.showResult('连接失败：' + error.message, 'error');
        }
    }

    showResult(message, type) {
        const resultBox = document.getElementById('configResult');
        resultBox.textContent = message;
        resultBox.className = `result-box ${type}`;
        setTimeout(() => {
            resultBox.style.display = 'none';
        }, 3000);
    }

    bindSheetEvents() {
        document.getElementById('refreshSheets').addEventListener('click', () => {
            this.loadSheets();
        });
    }

    async loadSheets() {
        try {
            const response = await fetch(
                `${this.config.serviceUrl}/api/sheet_meta?dataSourceId=${this.config.dataSourceId}`
            );
            const data = await response.json();
            
            if (data.code === 0) {
                this.sheets = data.data.sheets;
                this.renderSheets(this.sheets);
                this.updateSheetSelector(this.sheets);
                this.showResult('表结构加载成功！', 'success');
            } else {
                this.showResult('加载失败：' + data.message, 'error');
            }
        } catch (error) {
            this.showResult('加载失败：' + error.message, 'error');
        }
    }

    renderSheets(sheets) {
        const container = document.getElementById('sheetsList');
        
        if (!sheets || sheets.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>暂无表数据</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sheets.map(sheet => `
            <div class="sheet-card">
                <div class="sheet-header">
                    <div>
                        <div class="sheet-name">${sheet.sheetName}</div>
                        <div class="sheet-id">${sheet.sheetId}</div>
                    </div>
                </div>
                <div class="columns-list">
                    ${sheet.columns.map(col => `
                        <div class="column-item">
                            <span class="column-name">${col.columnName}</span>
                            <div>
                                <span class="column-type">${col.dataType}</span>
                                ${col.isPrimary ? '<span class="column-badge primary">主键</span>' : ''}
                                ${col.required ? '<span class="column-badge required">必填</span>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    updateSheetSelector(sheets) {
        const selector = document.getElementById('sheetSelector');
        selector.innerHTML = '<option value="">请选择表</option>' +
            sheets.map(sheet => `<option value="${sheet.sheetId}">${sheet.sheetName}</option>`).join('');
    }

    bindRecordEvents() {
        document.getElementById('queryRecords').addEventListener('click', () => {
            this.loadRecords();
        });

        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadRecords();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.currentPage++;
            this.loadRecords();
        });
    }

    async loadRecords() {
        const sheetId = document.getElementById('sheetSelector').value;
        
        if (!sheetId) {
            alert('请选择表');
            return;
        }

        try {
            const url = `${this.config.serviceUrl}/api/records?dataSourceId=${this.config.dataSourceId}&sheetId=${sheetId}&page=${this.currentPage}&pageSize=${this.pageSize}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.code === 0) {
                this.renderRecords(data.data);
                this.updatePagination(data.data);
            } else {
                this.showResult('加载失败：' + data.message, 'error');
            }
        } catch (error) {
            this.showResult('加载失败：' + error.message, 'error');
        }
    }

    renderRecords(data) {
        const container = document.getElementById('recordsTable');
        
        if (!data.records || data.records.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>暂无记录数据</p>
                </div>
            `;
            return;
        }

        const records = data.records;
        const columns = Object.keys(records[0].values);
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        ${columns.map(col => `<th>${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${records.map(record => `
                        <tr>
                            <td>${record.id}</td>
                            ${columns.map(col => `<td>${this.formatValue(record.values[col])}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    formatValue(value) {
        if (value === null || value === undefined) {
            return '<span style="color: #999;">null</span>';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }

    updatePagination(data) {
        document.getElementById('pageInfo').textContent = 
            `第 ${data.page} 页 / 共 ${Math.ceil(data.total / data.pageSize)} 页`;
        
        document.getElementById('prevPage').disabled = data.page <= 1;
        document.getElementById('nextPage').disabled = !data.hasMore;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DatasourceApp();
});
