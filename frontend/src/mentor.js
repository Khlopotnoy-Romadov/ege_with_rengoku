import { reactive } from 'vue';
import { defaultMentor, mentors } from '@/data/mentors';

// Создаём реактивный объект
export const mentorState = reactive({
  current: defaultMentor,
  
  load() {
    const saved = localStorage.getItem('ege_mentor');
    if (saved) {
      const found = mentors.find(m => m.id === saved);
      if (found) {
        this.current = found;
        return;
      }
    }
    this.current = defaultMentor;
  },
  
  set(mentor) {
    this.current = mentor;
    localStorage.setItem('ege_mentor', mentor.id);
  }
});