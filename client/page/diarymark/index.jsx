import React, { Component } from 'react';
import { Calendar, TabBar, Icon, List, Switch, TextareaItem, Button, Toast, Tabs } from 'antd-mobile';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import moment from 'moment';
import copy from 'clipboard-copy';

import { className } from './index.css';
const TabBarItem = TabBar.Item;

const WORK_OVERTIME = 'WORK_OVERTIME';
const WORK_WEEK_REPORT = 'WORK_WEEK_REPORT';

const weekDay = ['日', '一', '二', '三', '四', '五', '六'];

const momentFormat = 'YYYYMMDD';

export default class DiaryMark extends Component {
    state = {
        selectedTab: 'work',
        dateTime: moment(),
        calendarVisible: false,
        isWork: false,
        weekReport: '',
        textFocus: false,
        tabs: [{
            title: '加班'
        }, {
            title: '周报'
        }, {
            title: '操作'
        }],
        workData: {},
        reportData: {},
        thisWeek: moment().isoWeek()
    }

    componentDidMount () {
        this.handleData();
        this.getData();
    }

    handleData () {
        const workData = this.filterData(JSON.parse(localStorage.getItem(WORK_OVERTIME)) || {});
        const reportData = this.filterData(JSON.parse(localStorage.getItem(WORK_WEEK_REPORT)) || {});
        this.setAllData(WORK_OVERTIME, workData);
        this.setAllData(WORK_WEEK_REPORT, reportData);
        this.setState({
            workData, reportData
        });
    }

    filterData (data) {
        const preMonth = moment().subtract(2, 'M');
        Object.keys(data).forEach(key => {
            if (moment(key, momentFormat).isBefore(preMonth)) {
                delete data[key];
            }
        });
        return data;
    }

    setAllData (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getData () {
        const isWork = this.getWork();
        const weekReport = this.getReport();
        this.setState({
            isWork,
            weekReport
        });
    }

    formatDate (momentDate) {
        return momentDate.format(momentFormat);
    }

    getWork () {
        const value = JSON.parse(localStorage.getItem(WORK_OVERTIME));
        return value[this.formatDate(this.state.dateTime)];
    }

    setWork (value) {
        const preValue = JSON.parse(localStorage.getItem(WORK_OVERTIME)) || {};
        preValue[this.formatDate(this.state.dateTime)] = value;
        localStorage.setItem(WORK_OVERTIME, JSON.stringify(preValue));
    }

    getReport () {
        const value = JSON.parse(localStorage.getItem(WORK_WEEK_REPORT));
        return value[this.formatDate(this.state.dateTime)];
    }

    setReport (value) {
        const preValue = JSON.parse(localStorage.getItem(WORK_WEEK_REPORT)) || {};
        preValue[this.formatDate(this.state.dateTime)] = value;
        localStorage.setItem(WORK_WEEK_REPORT, JSON.stringify(preValue));
    }

    preDay = () => {
        this.setState({
            dateTime: this.state.dateTime.subtract(1, 'd')
        }, () => {
            this.getData();
        });
    }
    nextDay = () => {
        this.setState({
            dateTime: this.state.dateTime.add(1, 'd')
        }, () => {
            this.getData();
        });
    }
    selectDate = () => {
        this.setState({
            calendarVisible: true
        });
    }
    handleWorkChange = () => {
        const isWork = !this.state.isWork;
        this.setWork(isWork);
        this.setState({
            isWork
        });
    }
    handleSaveReport = () => {
        this.setReport(this.state.weekReport);
        Toast.success('保存成功', 1);
    }
    handleCopyWork = async () => {
        const { workData } = this.state;
        const beforeMonth = moment().subtract(40, 'd');
        const result = Object.keys(workData).filter(item => moment(item, momentFormat).isSameOrAfter(beforeMonth) && workData[item]).map(item => item);
        result.sort((a, b) => a - b);
        try {
            await copy(result.map(item => moment(item, momentFormat).format('YYYY年M月D日')).join('\n'));
            Toast.success('复制成功');
        } catch (err) {
            Toast.fail('复制失败');
        }
    }
    handleCopyReport = async () => {
        const { reportData } = this.state;
        const result = Object.keys(reportData).filter(item => moment(item).isoWeek() === this.state.thisWeek).map(item => reportData[item]);
        try {
            await copy(result.join('\n-------------------\n'));
            Toast.success('复制成功');
        } catch (err) {
            Toast.fail('复制失败');
        }
    }
    render () {
        const { selectedTab, dateTime, calendarVisible, textFocus, weekReport, isWork, tabs, workData, reportData } = this.state;
        return (
            <div className={className}>
                <div className="date-time">
                    <div className="pre" onClick={this.preDay}>
                        <Icon type="left" />
                        <span>前一天</span>
                    </div>
                    <div className="time" onClick={this.selectDate}>
                        {`${dateTime.format('MM月DD日 周')}${weekDay[dateTime.weekday()]}`}
                    </div>
                    <div className="next" onClick={this.nextDay}>
                        <span>后一天</span>
                        <Icon type="right" />
                    </div>
                </div>
                <div className="tab-bar">
                    <TabBar
                        tintColor="#f4586d"
                        unselectedTintColor="#cacaca"
                    >
                        <TabBarItem
                            selected={selectedTab === 'work'}
                            icon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://p1.music.126.net/B-LVvwA2Rzztjk4JRymNvA==/109951163763658039.png) center center /  21px 21px no-repeat' }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://p1.music.126.net/ix4Mag3VGFezLnBoc33dOQ==/109951163763659034.png) center center /  21px 21px no-repeat' }}
                                />
                            }
                            title="工作"
                            key="work"
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'work'
                                });
                            }}
                        >
                            <List.Item
                                extra={<Switch
                                    checked={isWork}
                                    onChange={this.handleWorkChange}
                                    color="#f292f9"
                                />}
                            >加班</List.Item>
                            <div className={`text-input ${textFocus ? 'active' : ''}`}>
                                <TextareaItem
                                    placeholder="每日工作总结"
                                    rows={8}
                                    value={weekReport}
                                    onFocus={() => {
                                        this.setState({
                                            textFocus: true
                                        });
                                    }}
                                    onBlur={() => {
                                        this.setState({
                                            textFocus: false
                                        });
                                    }}
                                    onChange={(value) => {
                                        this.setState({
                                            weekReport: value
                                        });
                                    }}
                                ></TextareaItem>
                            </div>
                            <Button
                                type="ghost"
                                style={{
                                    margin: '40px 5px',
                                    color: '#f292f9'
                                }}
                                onClick={this.handleSaveReport}
                            >
                                保存
                            </Button>
                        </TabBarItem>
                        <TabBarItem
                            selected={selectedTab === 'manage'}
                            icon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://p1.music.126.net/4NqQZ7NDu08C-n1_sT2MFA==/109951163763657477.png) center center /  21px 21px no-repeat' }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://p1.music.126.net/PV8AVc9ybe4fR0uyy2pOXQ==/109951163763660842.png) center center /  21px 21px no-repeat' }}
                                />
                            }
                            title="统计"
                            key="manage"
                            onPress={() => {
                                this.handleData();
                                this.setState({
                                    selectedTab: 'manage'
                                });
                            }}
                        >
                            <Tabs
                                tabs={tabs}
                            >
                                <div className="">
                                    <List>
                                        {
                                            Object.keys(workData).filter(item => workData[item]).map(item => (
                                                <List.Item key={item} extra="加班啦">{`${moment(item, momentFormat).format('MM月DD日 周')}${weekDay[moment(item, momentFormat).weekday()]}`}</List.Item>
                                            ))
                                        }
                                    </List>
                                </div>
                                <div className="">
                                    <List>
                                        {
                                            Object.keys(reportData).filter(item => moment(item).isoWeek() === this.state.thisWeek).map(item => (
                                                <TextareaItem
                                                    title={`周${weekDay[moment(item, momentFormat).weekday()]}`}
                                                    autoHeight
                                                    value={reportData[item]}
                                                    key={item}
                                                />
                                            ))
                                        }
                                    </List>
                                </div>
                                <div>
                                    <Button
                                        type="primary"
                                        style={{
                                            margin: '40px 5px',
                                            color: '#f292f9',
                                            backgroundColor: 'white'
                                        }}
                                        onClick={this.handleCopyWork}
                                    >一键复制加班</Button>
                                    <Button
                                        type="primary"
                                        style={{
                                            margin: '40px 5px',
                                            color: '#f292f9',
                                            backgroundColor: 'white'
                                        }}
                                        onClick={this.handleCopyReport}
                                    >一键复制周报</Button>
                                </div>
                            </Tabs>
                        </TabBarItem>
                    </TabBar>
                </div>
                <Calendar
                    locale={zhCN}
                    visible={calendarVisible}
                    type="one"
                    onConfirm={(startDateTime) => {
                        this.setState({
                            dateTime: moment(startDateTime, momentFormat),
                            calendarVisible: false
                        }, () => {
                            this.getData();
                        });
                    }}
                    onCancel={() => {
                        this.setState({
                            calendarVisible: false
                        });
                    }}
                ></Calendar>
            </div>
        );
    }
}
