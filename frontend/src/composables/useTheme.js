import { ref, watch, onMounted } from 'vue';

const theme = ref('light');

export function useTheme() {
    // Загружаем сохраненную тему из localStorage
    const loadTheme = () => {
        const savedTheme = localStorage.getItem('ege_theme');
        if (savedTheme) {
            theme.value = savedTheme;
        } else {
            theme.value = 'light'; // По умолчанию светлая
        }
        applyTheme(theme.value);
    };

    // Применяем тему к документу
    const applyTheme = (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ege_theme', newTheme);
    };

    // Переключаем тему
    const toggleTheme = () => {
        const newTheme = theme.value === 'light' ? 'dark' : 'light';
        theme.value = newTheme;
        applyTheme(newTheme);
    };

    // Инициализация
    onMounted(() => {
        loadTheme();
    });

    // Следим за изменениями темы
    watch(theme, (newTheme) => {
        applyTheme(newTheme);
    });

    return {
        theme,
        toggleTheme,
        loadTheme
    };
}