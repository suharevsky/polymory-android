export class ArrayHelper {
    static valuesComparison(arr1, arr2) {
        if (arr1.length > 0 && arr2.length > 0) {
            const ret = [];
            arr1.sort();
            arr2.sort();
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < arr1.length; i++) {
                if (arr2.indexOf(arr1[i]) > -1) {
                    ret.push(arr1[i]);
                }
            }
            return ret;
        }
        return false;
    }

    static arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }


    static containsObject(obj, list) {
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
            if (list[i] !== obj && list[i].id === obj.id) {
                return true;
            }
        }

        return false;
    }

    static range(from, to) {
        let array = [];
        for(let i=from; i<=to; i++) {
            array.push(i);
        }

        return array;
    }
}
