import { Mail, MapPin, UserRoundCheck } from "lucide-react";

import type { GuestInstructor } from "../types";

type GuestInstructorCardProps = {
  instructor: GuestInstructor | null;
  isLoading: boolean;
  error: string | null;
};

export function GuestInstructorCard({
  instructor,
  isLoading,
  error,
}: GuestInstructorCardProps) {
  return (
    <section
      className="guest-instructor-card"
      aria-labelledby="guest-instructor-title"
    >
      <div className="guest-instructor-heading">
        <span className="guest-instructor-icon" aria-hidden="true">
          <UserRoundCheck size={20} />
        </span>
        <div>
          <p className="eyebrow">Participacao especial</p>
          <h2 id="guest-instructor-title">Instrutor convidado</h2>
        </div>
      </div>

      {isLoading ? (
        <p className="guest-instructor-muted">Buscando instrutor...</p>
      ) : error ? (
        <p className="guest-instructor-error" role="status">
          {error}
        </p>
      ) : instructor ? (
        <div className="guest-instructor-profile">
          <img
            alt={`Foto de ${instructor.name}`}
            height="72"
            src={instructor.avatarUrl}
            width="72"
          />

          <div className="guest-instructor-details">
            <strong>{instructor.name}</strong>
            <span>
              <Mail aria-hidden="true" size={16} />
              {instructor.email}
            </span>
            <span>
              <MapPin aria-hidden="true" size={16} />
              {instructor.nationality}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
