import {ActionTypes} from '../../containers/View/constants'
import {
    LOGIN,
    LOGGED,
    INITIATE_DOWNLOAD_TASK,
    INITIATE_DOWNLOAD_TASK_SUCCESS,
    DOWNLOAD_FILE
} from '../../containers/App/constants'

import {
    DRILL_DASHBOARDITEM,
    DELETE_DRILL_HISTORY,
    SELECT_DASHBOARD_ITEM_CHART,
    MONITORED_SYNC_DATA_ACTION,
    GLOBAL_CONTROL_CHANGE,
    MONITORED_SEARCH_DATA_ACTION,
    MONITORED_LINKAGE_DATA_ACTION
} from '../../containers/Dashboard/constants'

const {
    LOAD_VIEW_DATA_FROM_VIZ_ITEM,
    LOAD_VIEW_DATA_FROM_VIZ_ITEM_SUCCESS
} = ActionTypes

import { statistic, IOperation } from './statistic.dv'
//  console.log(statistic.getRecord('terminal'))

const dataAction = {
    [DRILL_DASHBOARDITEM]: 'drill',
    [DELETE_DRILL_HISTORY]: 'drill',
    [MONITORED_SYNC_DATA_ACTION]: 'sync',
    [MONITORED_SEARCH_DATA_ACTION]: 'search',
    [MONITORED_LINKAGE_DATA_ACTION]: 'linkage'
}

const otherAction = {
    [LOGGED]: 'login',
    [INITIATE_DOWNLOAD_TASK_SUCCESS]: 'download_task',
    [DOWNLOAD_FILE]: 'download'
}

export const monitoreAction = (action: string) => {
    const actionType = mapMonitoreToAction(action, statistic.getRecord('operation')['action'])
}


function mapMonitoreToAction (action: string, initialType: string) {
    let actionType = initialType
    const isOtherAction = Object.entries(otherAction).map(([k, v]) => k).some((other) => other === action)
    const isDataAction =  Object.entries(dataAction).map(([k, v]) => k).some((other) => other === action)
    if (isOtherAction) {
        actionType = otherAction[action]
      //  statistic.updateSingleFleld<IOperation>('operation', 'action', actionType)
      // todo 避免与initial混淆，此三种状态不update operationRecord  的action值
    }
    if (action === LOGGED) {
        // todo 从localstorege拿上一次时长数据 send server
        const record = statistic.getPrevDurationRecord()
        if (record && record.length) {
            // send server
            // callback
            // 记得 statistic.clearPrevDurationRecord()
        }
    }
    if (action === LOGIN) {
        console.log(statistic.getRecord('terminal'))
    }
    if (isDataAction) {
        actionType = dataAction[action]
        statistic.updateSingleFleld<IOperation>('operation', 'action', actionType, (data) => {
            const newData = {
                ...data,
                create_time: statistic.getCurrentDateTime()
            }
            console.log(newData)
        })
    }
    if (action === LOAD_VIEW_DATA_FROM_VIZ_ITEM_SUCCESS) {
        console.log(actionType)
        // todo 重启定时器
        statistic.isTimeout()
    }
}



