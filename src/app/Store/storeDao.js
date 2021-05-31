// storyIdx Check
async function selectStoryIdx(connection, storyIdx) {
    const storyIdxQuery = `
      select exists(select storyIdx from StoryImage where storyIdx = ? and status = 'N') as exist;
       `;
    const [storyIdxRow] = await connection.query(storyIdxQuery, storyIdx);
    return storyIdxRow;
}

// Store storyIdx Check
async function selectStoreStoryIdx(connection, storeIdx) {
    const storyIdxQuery = `
      select exists(select storeIdx from StoryImage where storeIdx = ? and status = 'N') as exist;
       `;
    const [storyIdxRow] = await connection.query(storyIdxQuery, storeIdx);
    return storyIdxRow;
}

// Read Story Check
async function selectNotReadStory(connection, [storeIdx, userIdx]) {

    const selectStoreStoryQuery = `
        select s.storyIdx
        from StoryImage s
        left join StoryReadCount src on s.storyIdx = src.storyIdx
        where storeIdx = ? and src.userIdx = ?;
      `;
    const [selectStoreStoryRow] = await connection.query(selectStoreStoryQuery, [storeIdx, userIdx]);
  
    return selectStoreStoryRow;
}

// Story User Read Check
async function selectStoryReadCheck(connection, [storyIdx, userIdx]) {
    const readCheckQuery = `
      select exists(select storyIdx from StoryReadCount src where storyIdx = ? and userIdx = ?) as exist;
       `;
    const [readCheckRow] = await connection.query(readCheckQuery, [storyIdx, userIdx]);
    return readCheckRow;
}

// Insert Read Count
async function insertReadCount(connection, [storyIdx, userIdx]) {

    const insertReadCountQuery = `
        insert into StoryReadCount(storyIdx, userIdx)
        values (?, ?)
      `;
    const [insertReadCountRow] = await connection.query(insertReadCountQuery, [storyIdx, userIdx]);
  
    return insertReadCountRow;
}

// Insert Store Story
async function insertStoreStory(connection, [storeIdx, storyUrl]) {

    const insertStoreStoryQuery = `
        insert into StoryImage(storeIdx, storyUrl)
        values (?, ?)
      `;
    const [insertStoreStoryRow] = await connection.query(insertStoreStoryQuery, [storeIdx, storyUrl]);
  
    return insertStoreStoryRow;
}

// Get Store Story
async function selectStoreStory(connection, storeIdx) {

    const selectStoreStoryQuery = `
        select storeIdx, storyUrl
        from StoryImage s
        where storeIdx = ?
        order by s.createdAt DESC limit 1;
      `;
    const [selectStoreStoryRow] = await connection.query(selectStoreStoryQuery, storeIdx);
  
    return selectStoreStoryRow;
}

// Get Store Story
async function selectStoreStoryIdxList(connection, storeIdx) {

    const selectStoreStoryQuery = `
        select si.storyIdx
        from StoryImage si
        where si.storeIdx = ? and status = 'N' and timestampdiff(day, si.createdAt, current_timestamp()) < 7
        order by si.createdAt;
      `;
    const [selectStoreStoryRow] = await connection.query(selectStoreStoryQuery, storeIdx);
  
    return selectStoreStoryRow;
}


// Get Story
async function selectStory(connection, [storyIdx, userIdx]) {

    const selectStoryQuery = `
    select si.storeIdx, s.storeUrl, s.storeName,
       case
            when timestampdiff(day, si.createdAt, current_timestamp()) < 1
                then
                    concat(timestampdiff(hour, si.createdAt, current_timestamp()), '시간 전')
            else
                 concat(timestampdiff(day, si.createdAt, current_timestamp()), '일 전') end as createdAt,
       storyUrl, si.productIdx, p.productContents, ifnull(v.status, 'N') as likeFlag

    from StoryImage si
    left join Store s on s.storeIdx = si.storeIdx
    left join Product p on si.productIdx = p.productIdx
    left join (select ifnull(lp.status, 'N') as status, p.productIdx, p.productContents as productContents
    from Product p left join LikeProduct lp on p.productIdx = lp.productIdx
        left join User u on u.userIdx = lp.userIdx where lp.userIdx = ?) as v on v.productIdx = si.productIdx
    where si.storyIdx = ? and si.status = 'N' and timestampdiff(day, si.createdAt, current_timestamp()) < 7;
        `;
    const [selectStoryRow] = await connection.query(selectStoryQuery, [userIdx, storyIdx]);

return selectStoryRow;
}

// Get Store Story
async function selectBookMarkStoreStory(connection, userIdx) {

    const storyListQuery = `
        select s.storeIdx, s.storeUrl, s.storeName
        from StoryImage si
        left join Store s on si.storeIdx = s.storeIdx
        left join Bookmark b on si.storeIdx = b.storeIdx
        left join User u on u.userIdx = b.userIdx
        where si.status = 'N' and timestampdiff(day, si.createdAt, current_timestamp()) < 7 and u.userIdx = ? and b.status = 'N'
        group by s.storeIdx
        order by si.createdAt DESC;
      `;
    const [storyListRow] = await connection.query(storyListQuery, userIdx);
  
    return storyListRow;
}

// Get Rank Store
async function selectRankStore(connection, [userIdx, condition, page, size]) {

    const rankStoreQuery = `
    select s.storeIdx,
       s.storeUrl,
       s.storeName,
       s.mainCategory,
       case
           when maxCouponPrice is null
               then ''

           else
               concat('최대 ', format(maxCouponPrice, 0), '원 할인 쿠폰') end as maxCouponPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                                                  as deliveryPrice,
       ifnull(z.status, 'N')                                           as bookmarkStatus,
       ifnull(bookmarkCount, 0) as bookmarkCount
    from Store s
         left join Product p on p.storeIdx = s.storeIdx
         left join Category c on p.categoryIdx = c.categoryIdx
         left join ProductDetail pd on p.productIdx = pd.productIdx
         left join (select ifnull(count(s.storeIdx), 0) as bookmarkCount, s.storeIdx from Store s left join Bookmark bm on bm.storeIdx = s.storeIdx
             where bm.status = 'N' group by s.storeIdx) as a on s.storeIdx = a.storeIdx
         left join (select ifnull(bm.status, 'N') as status, s.storeIdx
                    from Store s
                             left join Bookmark bm on bm.storeIdx = s.storeIdx
                             left join User u on u.userIdx = bm.userIdx
                    where bm.userIdx = ?) as z on z.storeIdx = s.storeIdx
         left join (select ifnull(count(rc.productIdx), 0) as readCount, s.storeIdx
                    from Store s
                             left join Product p
                                       on s.storeIdx = p.storeIdx
                             left join Category c on c.categoryIdx = p.categoryIdx
                             left join ReadCount rc on rc.productIdx = p.productIdx
                    where p.status = 'N' ` + condition + `
                      
                    group by s.storeIdx) as v on v.storeIdx = s.storeIdx
         left join (select ifnull(sum(pb.productNum), 0) as orderCount, p.storeIdx
                    from Product p
                             left join Category c on c.categoryIdx = p.categoryIdx
                             left join ProductDetail pd on p.productIdx = pd.productIdx
                             left join ProductBasket pb on pb.productDetailIdx = pd.productDetailIdx
                             left join Basket b on b.basketIdx = pb.basketIdx
                             left join OrderProduct op on op.basketIdx = b.basketIdx
                    where op.confirm = 'Y'
                      and p.status = 'N' ` + condition + `
                      
                    group by p.productIdx) as w on w.storeIdx = s.storeIdx
         left join (select sum(r.score) as score, storeIdx
                    from Product p
                             left join Category c on c.categoryIdx = p.categoryIdx
                             left join Review r on p.productIdx = r.productIdx
                    where r.status = 'N'
                      and p.status = 'N' ` + condition + `
                    group by p.storeIdx) as y on y.storeIdx = s.storeIdx
         left join (select max(c.couponPrice) as maxCouponPrice, s.storeIdx from Store s left join Coupon c on s.storeIdx = c.storeIdx where c.status = 'N'
         group by s.storeIdx) as x
                   on x.storeIdx = s.storeIdx
    where s.status = 'N' ` + condition + `
    group by s.storeIdx
    order by (readCount + orderCount + score) DESC
    limit ` + page + `, ` + size + `;

      `;
    const [rankStoreRow] = await connection.query(rankStoreQuery, [userIdx, condition, page, size]);
  
    return rankStoreRow;
}

// Get Bookmark Store
async function selectBookMarkStore(connection, [userIdx, condition, page, size]) {

    const storeListQuery = `
        select s.storeIdx,
        s.storeUrl,
        s.storeName,
        s.mainCategory,
        case
            when maxCouponPrice is null
                then ''

            else
                concat('최대 ', format(maxCouponPrice, 0), '원 할인 쿠폰') end as maxCouponPrice,
        case
            when s.deliveryPrice = 0
                then '무료배송'
            else
                '' end                                                  as deliveryPrice
        from Store s
        left join Product p on p.storeIdx = s.storeIdx
        left join Bookmark bm on bm.storeIdx = s.storeIdx
        left join User u on u.userIdx = bm.userIdx
        left join (select max(c.couponPrice) as maxCouponPrice, s.storeIdx from Store s left join Coupon c on s.storeIdx = c.storeIdx where c.status = 'N' group by s.storeIdx) as x
                    on x.storeIdx = s.storeIdx
        where s.status = 'N' and bm.userIdx = ? and bm.status = 'Y' ` + condition + `
        group by s.storeIdx
        order by bm.createdAt DESC
        limit ` + page + `, ` + size + `;
      `;
    const [storeListRow] = await connection.query(storeListQuery, [userIdx, condition, page, size]);
  
    return storeListRow;
}
  



module.exports = {
    selectStoryIdx,
    selectStoreStoryIdx,
    selectNotReadStory,
    insertStoreStory,
    selectStoreStory,
    selectStory,
    selectStoryReadCheck,
    insertReadCount,
    selectStoreStoryIdxList,
    selectBookMarkStoreStory,
    selectRankStore,
    selectBookMarkStore
  };