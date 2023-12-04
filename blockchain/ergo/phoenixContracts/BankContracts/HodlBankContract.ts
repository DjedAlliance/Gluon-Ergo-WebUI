import { OutputInfo } from "@/blockchain/ergo/explorerApi";


interface BurnAmount {
    expectedAmountWithdrawn: bigint;
    devFeeAmount: bigint;
    bankFeeAmount: bigint;
}

export class HodlBankContract {
    private readonly contractBox: OutputInfo;

    constructor(box: OutputInfo) {
        this.contractBox = box;
    }

    getTotalTokenSupply(): bigint {
        const r4 = this.contractBox.additionalRegisters.R4;
        if (!r4) {
            throw new Error("R4 not found");
        }
        return BigInt(r4.renderedValue);
    }

    getPrecisionFactor(): bigint {
        const r5 = this.contractBox.additionalRegisters.R5;
        if (!r5) {
            throw new Error("R5 not found");
        }
        return BigInt(r5.renderedValue);
    }

    getMinBankValue(): bigint {
        const r6 = this.contractBox.additionalRegisters.R6;
        if (!r6) {
            throw new Error("R6 not found");
        }
        return BigInt(r6.renderedValue);
    }

    getDevFeeNum(): bigint {
        const r7 = this.contractBox.additionalRegisters.R7;
        if (!r7) {
            throw new Error("R7 not found");
        }
        return BigInt(r7.renderedValue);
    }

    getBankFeeNum(): bigint {
        const r8 = this.contractBox.additionalRegisters.R8;
        if (!r8) {
            throw new Error("R8 not found");
        }
        return BigInt(r8.renderedValue);
    }

    getTVL(): bigint {
        return BigInt(this.contractBox.value);
    }

    getHodlERGReserveAmount(): bigint {
        return BigInt(this.contractBox.assets![1].amount);
    }

    getBoxBlockHeight(): number {
        return this.contractBox.settlementHeight;
    }

    getHodlERG3EmissionAmount(): bigint {
        return this.getTotalTokenSupply() - this.getHodlERGReserveAmount();
    }

    getProtocolFeesCollected(): bigint {
        return this.getTVL() -  this.getHodlERG3EmissionAmount();
    }

    getHodlERGPrice(): bigint {
        const reserveIn = BigInt(this.contractBox.value);
        const totalTokenSupply = this.getTotalTokenSupply();
        const hodlCoinsIn = BigInt(this.contractBox.assets![1].amount);
        const hodlCoinsCircIn = totalTokenSupply - hodlCoinsIn;
        const precisionFactor = this.getPrecisionFactor();

        return (reserveIn * precisionFactor) / hodlCoinsCircIn;
    }

    mintAmount(hodlMintAmt: bigint): bigint {
        const price = this.getHodlERGPrice();
        const precisionFactor = this.getPrecisionFactor();

        return (hodlMintAmt * price) / precisionFactor;
    }

    burnAmount(hodlBurnAmt: bigint): BurnAmount {
        const feeDenom = BigInt(1000);

        const devFee = this.getDevFeeNum();
        const bankFee = this.getBankFeeNum();

        const price = this.getHodlERGPrice();
        const precisionFactor = this.getPrecisionFactor();

        const beforeFees = (hodlBurnAmt * price) / precisionFactor;
        const bankFeeAmount = (beforeFees * bankFee) / feeDenom;

        const devFeeAmount = (beforeFees * devFee) / feeDenom;

        const expectedAmountWithdrawn = beforeFees - bankFeeAmount - devFeeAmount;

        return {
            expectedAmountWithdrawn: expectedAmountWithdrawn, // amount of ERG returned to user
            devFeeAmount: devFeeAmount,
            bankFeeAmount: bankFeeAmount,
        };
    }
}
