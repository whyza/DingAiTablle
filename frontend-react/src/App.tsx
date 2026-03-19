import { useEffect, useState } from 'react';
import './App.css';

interface Config {
  serviceUrl: string;
  dataSourceId: string;
  dataSourceName: string;
  description?: string;
}

function App() {
  const [config, setConfig] = useState<Config>({
    serviceUrl: 'https://your-service.com',
    dataSourceId: '',
    dataSourceName: '',
    description: ''
  });
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // 模拟iframe环境初始化
    console.log('iframe环境初始化成功（模拟）');
    setIsReady(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAndNext = async () => {
    if (!config.serviceUrl || !config.dataSourceId || !config.dataSourceName) {
      alert('请填写完整配置信息');
      return;
    }

    try {
      // 模拟saveConfigAndGoNext调用
      console.log('保存配置并进入下一步:', config);
      
      // 保存配置到本地存储
      localStorage.setItem('datasourceConfig', JSON.stringify(config));
      
      // 模拟成功提示
      alert('配置保存成功！\n\n' + 
            '服务地址: ' + config.serviceUrl + '\n' +
            '数据源ID: ' + config.dataSourceId + '\n' +
            '数据源名称: ' + config.dataSourceName);
    } catch (error) {
      console.error('保存配置失败', error);
      alert('保存配置失败: ' + JSON.stringify(error));
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>正在初始化...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="config-form">
        <h1 className="form-title">数据源插件配置</h1>
        
        <div className="form-group">
          <label className="form-label">
            服务地址 <span className="required">*</span>
          </label>
          <input
            type="text"
            name="serviceUrl"
            value={config.serviceUrl}
            onChange={handleInputChange}
            placeholder="https://your-service.com"
            className="form-input"
          />
          <small className="form-hint">
            公网可访问的服务地址，例如: https://your-service.com
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">
            数据源ID <span className="required">*</span>
          </label>
          <input
            type="text"
            name="dataSourceId"
            value={config.dataSourceId}
            onChange={handleInputChange}
            placeholder="请输入数据源ID"
            className="form-input"
          />
          <small className="form-hint">
            唯一标识数据源，例如: mysql_datasource_001
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">
            数据源名称 <span className="required">*</span>
          </label>
          <input
            type="text"
            name="dataSourceName"
            value={config.dataSourceName}
            onChange={handleInputChange}
            placeholder="请输入数据源名称"
            className="form-input"
          />
          <small className="form-hint">
            数据源显示名称，例如: MySQL业务数据库
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">
            描述
          </label>
          <textarea
            name="description"
            value={config.description}
            onChange={handleInputChange}
            placeholder="请输入数据源描述（可选）"
            className="form-textarea"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button
            onClick={handleSaveAndNext}
            className="btn-primary"
          >
            下一步
          </button>
        </div>

        <div className="form-info">
          <h3>配置说明</h3>
          <ul>
            <li>服务地址：需要是公网可访问的HTTPS地址</li>
            <li>数据源ID：唯一标识，用于区分不同的数据源</li>
            <li>数据源名称：在AI表格中显示的名称</li>
            <li>配置保存后将进入字段配置页面</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
