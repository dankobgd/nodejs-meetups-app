module.exports = {
  //  FORMAT LONG DATE
  FORMAT_LONG_DATE(content) {
    const monthsList = [
      'Januar',
      'Februar',
      'Mart',
      'April',
      'Maj',
      'Jun',
      'Jul',
      'Avgust',
      'Septembar',
      'Oktobar',
      'Novembar',
      'Decembar',
    ];
    const daysList = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Cetvrtak', 'Petak', 'Subota'];
    const newDate = new Date(content);
    const year = newDate.getFullYear();
    const date = newDate.getDate();
    const month = monthsList[newDate.getMonth()];
    const day = daysList[newDate.getDay()];
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();

    return minutes < 10
      ? `${day}, ${date}. ${month} ${year} - ${hours}:0${minutes}`
      : `${day}, ${date}. ${month} ${year} - ${hours}:${minutes}`;
  },

  //  FORMAT SHORT DATE
  FORMAT_SHORT_DATE(content) {
    const newDate = new Date(content);
    const year = newDate.getFullYear();
    const date = newDate.getDate();
    const month = newDate.getMonth();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();

    return minutes < 10
      ? `${date}/${month + 1}/${year} - ${hours}:0${minutes}`
      : `${date}/${month + 1}/${year} - ${hours}:${minutes}`;
  },

  //  CHECK IF COMMENT OWNER
  IF_COMMENT_OWNER(a, b, options) {
    if (a && b) {
      if (a._id.toString() === b.id.toString()) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  },

  // PAGINATION
  PAGINATE(pagination, options) {
    const type = options.hash.type || 'middle';
    let ret = '';
    const pageCount = Number(pagination.pageCount);
    const page = Number(pagination.page);
    let limit;
    if (options.hash.limit) limit = +options.hash.limit;

    let newContext = {};
    switch (type) {
      case 'middle':
        if (typeof limit === 'number') {
          let i = 0;
          let leftCount = Math.ceil(limit / 2) - 1;
          const rightCount = limit - leftCount - 1;
          if (page + rightCount > pageCount) leftCount = limit - (pageCount - page) - 1;
          if (page - leftCount < 1) leftCount = page - 1;
          let start = page - leftCount;

          while (i < limit && i < pageCount) {
            newContext = {n: start};
            if (start === page) newContext.active = true;
            ret += options.fn(newContext);
            start++;
            i++;
          }
        } else {
          for (let i = 1; i <= pageCount; i++) {
            newContext = {n: i};
            if (i === page) newContext.active = true;
            ret += options.fn(newContext);
          }
        }
        break;
      case 'previous':
        if (page === 1) {
          newContext = {disabled: true, n: 1};
        } else {
          newContext = {n: page - 1};
        }
        ret += options.fn(newContext);
        break;
      case 'next':
        newContext = {};
        if (page === pageCount) {
          newContext = {disabled: true, n: pageCount};
        } else {
          newContext = {n: page + 1};
        }
        ret += options.fn(newContext);
        break;
      case 'first':
        if (page === 1) {
          newContext = {disabled: true, n: 1};
        } else {
          newContext = {n: 1};
        }
        ret += options.fn(newContext);
        break;
      case 'last':
        if (page === pageCount) {
          newContext = {disabled: true, n: pageCount};
        } else {
          newContext = {n: pageCount};
        }
        ret += options.fn(newContext);
        break;
      default:
        ret += options.fn({});
    }

    return ret;
  },

  dbg(c) {
    return JSON.stringify(c, 2, null);
  },
};
