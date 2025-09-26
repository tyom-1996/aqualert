// src/utils/helpers.ts


/**
 * Возвращает правильную форму слова на русском языке в зависимости от количества
 * @param count — число, для которого нужно подобрать форму
 * @param forms — массив из трёх форм: [единственное, несколько, множественное]
 * @returns правильная форма слова
 *
 * Пример:
 *   pluralizeRu(1, ['товар', 'товара', 'товаров'])  // 'товар'
 *   pluralizeRu(2, ['товар', 'товара', 'товаров'])  // 'товара'
 *   pluralizeRu(5, ['товар', 'товара', 'товаров'])  // 'товаров'
 */
export function pluralizeRu(
    count: number,
    forms: [string, string, string],
): string {
    const n = Math.abs(count) % 100
    const n1 = n % 10

    if (n > 10 && n < 20) {
        return forms[2]
    }
    if (n1 === 1) {
        return forms[0]
    }
    if (n1 >= 2 && n1 <= 4) {
        return forms[1]
    }
    return forms[2]
}

/**
 * Специализированная функция для слова «уведомление»
 * @param count — количество уведомлений
 * @returns правильная форма «уведомление»
 */

export function declineNotifications(count: number): string {
    return pluralizeRu(count, ['уведомление', 'уведомления', 'уведомлений'])
}

export function declineAttempts(count: number): string {
    return pluralizeRu(count, ['попытка', 'попытки', 'попыток'])
}

/**
 * Открывает переданный URL в браузере.
 * @param url — ссылка для открытия (должна начинаться с http:// или https://)
 */


export const formatPhoneNumber = (phone: any): string => {
    if (phone != null) {
        const digits = phone.replace(/\D/g, '');
        return digits.startsWith('373')
            ? `+373 ${digits.slice(3, 6)}${digits.slice(6, 11)}`
            : phone;
    }

    return phone;

};


export const isStrongPassword = (pwd: string): boolean => {
    const letterCount = (pwd.match(/[A-Za-zА-Яа-я]/g) || []).length;
    return pwd.length >= 8 && letterCount >= 3;
};

export const areBothPasswordsValid = (
    pwd1: string,
    pwd2: string
): { isFirstValid: boolean; isSecondValid: boolean; bothValid: boolean } => {
    const firstValid = isStrongPassword(pwd1);
    const secondValid = isStrongPassword(pwd2);
    return { isFirstValid: firstValid, isSecondValid: secondValid, bothValid: firstValid && secondValid };
};



/**
 * Склоняет слово «день» по-русски
 */
function pluralizeDays(count: number): string {
    const forms = ['день', 'дня', 'дней'];
    const n = count % 100;
    if (n >= 11 && n <= 19) return forms[2];
    const n1 = count % 10;
    if (n1 === 1) return forms[0];
    if (n1 >= 2 && n1 <= 4) return forms[1];
    return forms[2];
}

/**
 * Форматирует время с момента регистрации
 * @param hoursSinceRegistration — целое число часов
 * @returns «Зарегистрирован сегодня», «Зарегистрирован вчера», «Зарегистрирован 2 дня назад» и т.д.
 */
export function formatRegistrationDate(hoursSinceRegistration: number): string {
    const days = Math.floor(hoursSinceRegistration / 24);

    if (days === 0) {
        return 'Зарегистрирован сегодня';
    }
    if (days === 1) {
        return 'Зарегистрирован вчера';
    }
    if (days === 2) {
        return 'Зарегистрирован позавчера';
    }
    return `Зарегистрирован ${days} ${pluralizeDays(days)} назад`;
}



/**
 * Убирает код страны «373» (с плюсом или без) из начала телефонного номера.
 * Если «373» встречается не в начале, остается без изменений.
 *
 * @param input Строка, из которой нужно убрать «373»
 * @returns Строка без префикса «373» или «+373»
 */
export function strip373(input: string): string {
    if (input) {
        return input.replace(/^(\+?373)/, '')
    }

    return '';
}
