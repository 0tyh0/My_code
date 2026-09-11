import relationalStore from "@ohos:data.relationalStore";
import type common from "@ohos:app.ability.common";
import { AuthResult, User } from "@normalized:N&&&entry/src/main/ets/model/User&";
const DB_NAME: string = 'db_user.db';
const TABLE_NAME: string = 'tb_user';
const CREATE_TABLE_SQL: string = 'CREATE TABLE IF NOT EXISTS tb_user (' +
    'userid INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'username TEXT NOT NULL UNIQUE, ' +
    'upwd TEXT NOT NULL, ' +
    'utel TEXT NOT NULL UNIQUE, ' +
    'uemail TEXT NOT NULL UNIQUE, ' +
    'isenable INTEGER NOT NULL DEFAULT 1)';
const INSERT_IGNORE_SQL: string = 'INSERT OR IGNORE INTO tb_user ' +
    '(userid, username, upwd, utel, uemail, isenable) VALUES (?, ?, ?, ?, ?, ?)';
class SeedAccount {
    userId: number = 0;
    username: string = '';
    password: string = '';
    tel: string = '';
    email: string = '';
    enabled: number = 1;
    constructor(userId: number, username: string, password: string, tel: string, email: string, enabled: number) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.tel = tel;
        this.email = email;
        this.enabled = enabled;
    }
}
export class UserDatabase {
    private static store: relationalStore.RdbStore | null = null;
    private static initTask: Promise<void> | null = null;
    static init(context: common.Context): Promise<void> {
        if (UserDatabase.store !== null) {
            return Promise.resolve();
        }
        if (UserDatabase.initTask !== null) {
            return UserDatabase.initTask;
        }
        UserDatabase.initTask = UserDatabase.createAndInit(context);
        return UserDatabase.initTask;
    }
    private static async createAndInit(context: common.Context): Promise<void> {
        const config: relationalStore.StoreConfig = {
            name: DB_NAME,
            securityLevel: relationalStore.SecurityLevel.S1
        };
        const rdbStore: relationalStore.RdbStore = await relationalStore.getRdbStore(context, config);
        await rdbStore.executeSql(CREATE_TABLE_SQL);
        await UserDatabase.seedDefaultUsers(rdbStore);
        UserDatabase.store = rdbStore;
    }
    private static async seedDefaultUsers(rdbStore: relationalStore.RdbStore): Promise<void> {
        const count: number = await UserDatabase.countUserRows(rdbStore);
        if (count >= 10) {
            return;
        }
        const accounts: Array<SeedAccount> = [
            new SeedAccount(1001, '张三', '123456', '13800000001', 'zhangsan@example.com', 1),
            new SeedAccount(1002, '李四', '123456', '13800000002', 'lisi@example.com', 1),
            new SeedAccount(1003, '王五', '123456', '13800000003', 'wangwu@example.com', 1),
            new SeedAccount(1004, '赵六', '123456', '13800000004', 'zhaoliu@example.com', 1),
            new SeedAccount(1005, '孙七', '123456', '13800000005', 'sunqi@example.com', 1),
            new SeedAccount(1006, '周八', '123456', '13800000006', 'zhouba@example.com', 1),
            new SeedAccount(1007, '吴九', '123456', '13800000007', 'wujiu@example.com', 1),
            new SeedAccount(1008, '郑十', '123456', '13800000008', 'zhengshi@example.com', 1),
            new SeedAccount(1009, '钱一', '123456', '13800000009', 'qianyi@example.com', 1),
            new SeedAccount(1010, '陈二', '123456', '13800000010', 'chener@example.com', 1),
            new SeedAccount(1011, '林三', '123456', '13800000011', 'linsan@example.com', 1),
            new SeedAccount(1012, '刘四', '000000', '13800000012', 'liusi@example.com', 0)
        ];
        for (let i: number = 0; i < accounts.length; i++) {
            const account: SeedAccount = accounts[i];
            const args: Array<relationalStore.ValueType> = [
                account.userId,
                account.username,
                account.password,
                account.tel,
                account.email,
                account.enabled
            ];
            await rdbStore.executeSql(INSERT_IGNORE_SQL, args);
        }
    }
    static async login(account: string, password: string): Promise<AuthResult> {
        if (UserDatabase.store === null) {
            return new AuthResult(false, '数据库尚未初始化', null, 0);
        }
        const store: relationalStore.RdbStore = UserDatabase.store;
        const predicates: relationalStore.RdbPredicates = new relationalStore.RdbPredicates(TABLE_NAME);
        predicates.beginWrap();
        predicates.equalTo('userid', UserDatabase.convertToUserId(account));
        predicates.or();
        predicates.equalTo('username', account);
        predicates.or();
        predicates.equalTo('utel', account);
        predicates.or();
        predicates.equalTo('uemail', account);
        predicates.endWrap();
        predicates.and();
        predicates.equalTo('isenable', 1);
        const resultSet: relationalStore.ResultSet = await store.query(predicates);
        let foundUser: User | null = null;
        try {
            if (resultSet.goToFirstRow()) {
                const user: User = UserDatabase.readUser(resultSet);
                if (user.upwd === password) {
                    foundUser = user;
                }
                else {
                    return new AuthResult(false, '密码错误', null, 0);
                }
            }
        }
        finally {
            resultSet.close();
        }
        if (foundUser === null) {
            return new AuthResult(false, '账号不存在或已被停用', null, 0);
        }
        return new AuthResult(true, '登录成功', foundUser, 0);
    }
    static async register(username: string, password: string, tel: string, email: string): Promise<AuthResult> {
        if (UserDatabase.store === null) {
            return new AuthResult(false, '数据库尚未初始化', null, 0);
        }
        const store: relationalStore.RdbStore = UserDatabase.store;
        const duplicated: boolean = await UserDatabase.hasDuplicatedUser(store, username, tel, email);
        if (duplicated) {
            return new AuthResult(false, '姓名、电话或邮箱已存在，请更换后重试', null, 0);
        }
        const values: relationalStore.ValuesBucket = {
            username: username,
            upwd: password,
            utel: tel,
            uemail: email,
            isenable: 1
        };
        try {
            const rowId: number = await store.insert(TABLE_NAME, values);
            return new AuthResult(true, `注册成功，用户编号为 ${rowId}`, null, rowId);
        }
        catch (err) {
            const reason: string = `${err}`;
            return new AuthResult(false, `注册失败：${reason}`, null, 0);
        }
    }
    static async getUserCount(): Promise<number> {
        if (UserDatabase.store === null) {
            return 0;
        }
        return UserDatabase.countUserRows(UserDatabase.store);
    }
    private static async countUserRows(rdbStore: relationalStore.RdbStore): Promise<number> {
        const resultSet: relationalStore.ResultSet = await rdbStore.querySql('SELECT COUNT(*) AS total FROM tb_user');
        let total: number = 0;
        try {
            if (resultSet.goToFirstRow()) {
                const index: number = resultSet.getColumnIndex('total');
                total = resultSet.getLong(index);
            }
        }
        finally {
            resultSet.close();
        }
        return total;
    }
    private static async hasDuplicatedUser(rdbStore: relationalStore.RdbStore, username: string, tel: string, email: string): Promise<boolean> {
        const predicates: relationalStore.RdbPredicates = new relationalStore.RdbPredicates(TABLE_NAME);
        predicates.beginWrap();
        predicates.equalTo('username', username);
        predicates.or();
        predicates.equalTo('utel', tel);
        predicates.or();
        predicates.equalTo('uemail', email);
        predicates.endWrap();
        const resultSet: relationalStore.ResultSet = await rdbStore.query(predicates);
        let exists: boolean = false;
        try {
            if (resultSet.goToFirstRow()) {
                exists = true;
            }
        }
        finally {
            resultSet.close();
        }
        return exists;
    }
    private static readUser(resultSet: relationalStore.ResultSet): User {
        const user: User = new User();
        user.userId = resultSet.getLong(resultSet.getColumnIndex('userid'));
        user.username = resultSet.getString(resultSet.getColumnIndex('username'));
        user.upwd = resultSet.getString(resultSet.getColumnIndex('upwd'));
        user.utel = resultSet.getString(resultSet.getColumnIndex('utel'));
        user.uemail = resultSet.getString(resultSet.getColumnIndex('uemail'));
        user.isenable = resultSet.getLong(resultSet.getColumnIndex('isenable'));
        return user;
    }
    private static convertToUserId(account: string): number {
        const numberPattern: RegExp = /^\d+$/;
        if (numberPattern.test(account)) {
            return Number(account);
        }
        return -1;
    }
}
