import { Component, signal, Inject, PLATFORM_ID, OnDestroy, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnDestroy {
  private startDate = new Date(2020, 0, 1);
  private birthday = new Date(2007, 11, 13); 
  greetings = ['Hello', 'Hola', 'Ciao'];
  greeting = signal(this.greetings[0]);

  private index = 0;
  private timer: any = null;

  age = computed(() => this.calculateAge(this.birthday));
  yearsOfExperience = computed(() => this.calculateYearsOfExperience(this.startDate));

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.timer = setInterval(() => {
        this.index = (this.index + 1) % this.greetings.length;
        this.greeting.set(this.greetings[this.index]);
      }, 2200);
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private calculateYearsOfExperience(startDate: Date): number {
    const today = new Date();
    let yearsOfExperience = today.getFullYear() - startDate.getFullYear();
    const monthDiff = today.getMonth() - startDate.getMonth();

    if (monthDiff < 0) {
      yearsOfExperience--;
    }

    return yearsOfExperience;
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}