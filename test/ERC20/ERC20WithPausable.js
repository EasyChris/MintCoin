const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20WithPausable");
const ERC20 = require('./ERC20');

contract('可暂停代币', accounts => {
    describe("布署合约...",async () => {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000000000          //发行总量
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });

    describe("测试可暂停代币的特殊方法", () => {
        //测试是暂停者
        it('是暂停者: isPauser()', async () => {
            const isPauser = await ERC20Instance.isPauser(accounts[0]);
            assert.ok(isPauser);
        });
        //测试添加暂停者
        it('添加暂停者: addPauser()', async () => {
            await ERC20Instance.addPauser(accounts[1]);
            const isPauser = await ERC20Instance.isPauser(accounts[1]);
            assert.ok(isPauser);
        });
        //测试是否已暂停
        it('是否已暂停: paused()', async () => {
            await ERC20Instance.paused({ from: accounts[1] });
            const isPause = await ERC20Instance.paused();
            assert.ok(!isPause);
        });
        //测试暂停方法
        it('暂停方法: pause()', async () => {
            await ERC20Instance.pause({ from: accounts[1] });
            const isPause = await ERC20Instance.paused();
            assert.ok(isPause);
        });
        //测试暂停后发送代币
        it('暂停后发送代币: transfer() after pause', async () => {
            await assert.rejects(ERC20Instance.transfer(accounts[1], web3.utils.toWei('100', 'ether')), /paused/);
        });
        //测试恢复方法
        it('恢复方法: unpause()', async () => {
            await ERC20Instance.unpause({ from: accounts[1] });
            const isPause = await ERC20Instance.paused();
            assert.ok(!isPause);
        });
        //测试撤销暂停权
        it('撤销暂停权: renouncePauser()', async () => {
            await ERC20Instance.renouncePauser({ from: accounts[1] });
            const isPauser = await ERC20Instance.isPauser(accounts[1]);
            assert.ok(!isPauser);
        });
    });
});
