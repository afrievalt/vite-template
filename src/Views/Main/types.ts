export interface SessionPlayerSelection {
  playerId: string;
  name: string;
  description: string;
  amount: string;
  seatNumber: number;
  buyInAmount: number;
}

export interface SessionDetails {
  date: string;
  location: string;
  game: string;
  stakes: string;
}
