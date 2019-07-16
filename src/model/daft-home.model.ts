export interface DaftHome {
  id: string;
  title: string;
  price: string;
  url: string;

}

export interface DaftHomes {

  description: string;
  homes: DaftHome[];

}
