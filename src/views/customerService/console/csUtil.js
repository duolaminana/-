/**
 * 将input file转化成formData对象
 * @param {Element} file - input type=file dom element
 * @returns {Object} fd - FormData对象
 */
export function getFileFormData(file) {
  let fd = new FormData();
  fd.append(file.files[0].name, file.files[0]);
  return fd;
}
/**
 * fileReader预览图片返回img url
 * @param {Element} file - input type=file dom element
 * @param {Function} callback - 回调函数
 * @param {Function} callback2 - 回调函数
 */
export function imgReader(file, callback, callback2) {
  let files = file.files[0];
  if (!files) {
    return false;
  }
  if (!files.type || files.type === '' || !/image\/\w+/.test(files.type)) {
    callback();
    return false;
  }
  let reader = new FileReader();
  reader.readAsDataURL(files);
  let img = new Image();
  let promise = new Promise((resolve, reject) => {
    reader.onload = function (e) {
      img.src = this.result;
      let that = this;
      img.onload = function () {
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        resolve({
          src: that.result,
          width,
          height
        });
      };
    };
  }).catch(() => {
    console.log('Promise Rejected');
  });
  promise.then((value) => {
    callback2(value);
  }, (error) => {
    console.log('imgReader Error', error);
  }).catch(() => {
    console.log('Promise Rejected');
  });
}
/**
     * 将时间转化成需要的格式
     * @param {number} msgTime - 需要转换的时间毫秒数
     * @returns {string} showTime - 时间的标识，根据标识可以再页面应用不同的date管道
     * 当天 --- today
     * 昨天和前天 --- yesterday或the day before
     * 近7天（排除今天，昨天，前天） --- day
     * 今年其他时间 --- month
     * 今年之前的时间 --- year
     */
export function reducerDate(msgTime) {
  const time = new Date(msgTime);
  const now = new Date();
  const msgYear = time.getFullYear();
  const nowYear = now.getFullYear();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const nowSecond = now.getSeconds();
  const nowTime = now.getTime();
  const todayTime = nowHour * 60 * 1000 * 60 + nowMinute * 1000 * 60 + nowSecond * 1000;
  const gapDate = (nowTime - todayTime - msgTime) / 1000 / 60 / 60 / 24;
  let showTime = '';
  if (msgYear !== nowYear) {
    showTime = 'year';
  } else if (gapDate > 6) {
    showTime = 'month';
  } else if (gapDate <= 6 && gapDate > 2) {
    showTime = 'day';
  } else if (gapDate <= 2 && gapDate > 1) {
    showTime = 'the day before';
  } else if (gapDate <= 1 && gapDate > 0) {
    showTime = 'yesterday';
  } else if (gapDate <= 0) {
    showTime = 'today';
  }
  return showTime;
}
/**
     * 深度拷贝对象（只能深度拷贝没有方法属性的对象）
     * @param {Object} obj - 需要拷贝的对象
     * @returns {Object} result - 新的对象
     */
export function deepCopyObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export function getActiveIndex(messageList, item) {
  return messageList.findIndex(
    i => Number(i.key) === Number(item.key)
  )
}
/**
* 发送文件时截取后缀名作为拓展字段
* @param {string} name - 文件名
* @returns {string} 后缀名
*/
export function getExt(name) {
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.substring(index + 1);
}

/**
 * 格式化长度过长的文件名（保留后缀名）
 */
export function transformFileName(fileName, num) {
  if (fileName.length <= num) {
    return fileName;
  }
  const index = fileName.lastIndexOf('.');
  let newName = '';
  if (index === -1) {
    if (fileName.length > num) {
      newName = fileName.substr(0, num - 3) + '...';
    } else {
      newName = fileName;
    }
  } else {
    const name = fileName.substring(0, index);
    const ext = fileName.substring(index);
    if (name.length > num - ext.length && num > 5 + ext.length) {
      const lastStr = name.substring(name.length - 2);
      const firstStr = name.substr(0, num - ext.length - 2 - 3);
      newName = `${firstStr}...${lastStr}${ext}`;
    } else if (num <= 5 + ext.length && num > ext.length + 2) {
      const n = name.substring(0, num - ext.length - 1);
      newName = `${n}..${ext}`;
    } else if (fileName.length > num) {
      newName = fileName.substring(0, num - 3) + '...';
    } else {
      newName = fileName;
    }
  }
  return newName;
}
export function transformFileSize(size) {
  let newSize = '';
  if (size > 1024 * 1024) {
    newSize = (size / (1024 * 1024)).toFixed(2) + 'M';
  } else {
    let sizeNum = (size / 1024).toFixed(2);
    // 小于0.01KB的文件显示0.01KB
    newSize = (Number(sizeNum) >= 0.01 ? sizeNum : 0.01) + 'KB';
  }
  return newSize;
}

