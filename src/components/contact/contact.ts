import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  NgZone,
  AfterViewInit,
  signal,
} from "@angular/core";

import { FormsModule } from "@angular/forms";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../environment";

declare const google: any;

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./contact.html",
  styleUrl: "./contact.css",
})
export class Contact implements AfterViewInit {
  private readonly SERVICE_ID = environment.emailJsServiceId;
  private readonly TEMPLATE_ID_NOTIFY = environment.emailJsTemplateIdNotify;
  private readonly PUBLIC_KEY = environment.emailJsPublicKey;
  private readonly GOOGLE_CLIENT_ID = environment.googleClientId;

  submitted = false;
  sending = false;

  error = false;
  errorMsg = "";

  countdown = 0;
  currentYear = new Date().getFullYear();

  name = "";
  service = "";
  message = "";

  email = signal("");
  emailLocked = signal(false);

  private countdownTimer: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.loadGoogle();
  }

  /*
    GOOGLE LOGIN
  */

  private loadGoogle() {
    if ((window as any).google?.accounts?.id) {
      this.initGoogle();
      return;
    }

    if (document.getElementById("google-gsi")) {
      const wait = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(wait);
          this.initGoogle();
        }
      }, 150);

      return;
    }

    const script = document.createElement("script");

    script.id = "google-gsi";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => this.initGoogle();

    document.body.appendChild(script);
  }

  private initGoogle() {
    if (!(window as any).google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: this.GOOGLE_CLIENT_ID,

      callback: (response: any) => this.handleCredential(response),

      auto_select: false,
    });

    const button = document.getElementById("google-signin");

    if (button) {
      google.accounts.id.renderButton(button, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
      });
    }

    google.accounts.id.prompt();
  }

  private handleCredential(response: any) {
    try {
      const base64Url = response.credential.split(".")[1];

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2),
          )
          .join(""),
      );

      const payload = JSON.parse(json);

      this.zone.run(() => {
        this.email.set(payload.email || "");

        if (!this.name) {
          this.name = payload.name || "";
        }

        this.emailLocked.set(Boolean(payload.email));

        this.error = false;
        this.errorMsg = "";

        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error("Google credential error:", error);
    }
  }

  /*
    VALIDATION
  */

  private isValidEmailFormat(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  private validateForm(): boolean {
    const cleanName = this.name.trim();

    const cleanMessage = this.message.trim();

    if (!cleanName) {
      this.showError("Please enter your name.");

      return false;
    }

    if (cleanName.length < 2) {
      this.showError("Your name must contain at least 2 characters.");

      return false;
    }

    if (cleanName.length > 50) {
      this.showError("Your name cannot exceed 50 characters.");

      return false;
    }

    if (!this.service) {
      this.showError("Please select a service.");

      return false;
    }

    if (cleanMessage.length < 25) {
      this.showError("Your message must contain at least 25 characters.");

      return false;
    }

    if (cleanMessage.length > 1000) {
      this.showError("Your message cannot exceed 1000 characters.");

      return false;
    }

    return true;
  }

  private showError(message: string) {
    this.error = true;
    this.errorMsg = message;

    this.cdr.detectChanges();
  }

  /*
    SUBMIT
  */

  async onSubmit(event: Event) {
    event.preventDefault();

    if (!isPlatformBrowser(this.platformId)) return;

    this.error = false;
    this.errorMsg = "";

    const userEmail = this.email();

    if (!userEmail) {
      this.showError("Please sign in with Google before sending.");

      return;
    }

    if (!this.isValidEmailFormat(userEmail)) {
      this.showError("Please use a valid email address.");

      return;
    }

    if (!this.validateForm()) return;

    this.sending = true;

    try {
      const emailjs = await import("@emailjs/browser");

      await emailjs.send(
        this.SERVICE_ID,

        this.TEMPLATE_ID_NOTIFY,

        {
          from_name: this.name.trim(),

          from_email: userEmail,

          service: this.service,

          message: this.message.trim(),
        },

        {
          publicKey: this.PUBLIC_KEY,
        },
      );

      this.zone.run(() => {
        this.submitted = true;

        this.sending = false;

        this.startCountdown(5);

        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error("EmailJS error:", error);

      this.zone.run(() => {
        this.sending = false;

        this.showError("Unable to send your enquiry. Please try again later.");
      });
    }
  }

  /*
    RESET + COUNTDOWN
  */

  private resetForm() {
    this.name = "";
    this.service = "";
    this.message = "";

    this.error = false;
    this.errorMsg = "";

    if (!this.emailLocked()) {
      this.email.set("");
    }
  }

  private startCountdown(seconds: number) {
    this.countdown = seconds;

    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    this.countdownTimer = setInterval(() => {
      this.zone.run(() => {
        this.countdown--;

        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer);

          this.countdownTimer = null;

          this.submitted = false;

          this.resetForm();
        }

        this.cdr.detectChanges();
      });
    }, 1000);
  }
}
