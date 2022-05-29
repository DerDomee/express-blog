import {NextFunction, Request, Response} from 'express';

export interface ArticleAuthor {
  name: String;
  pictureId?: String;
};

export interface Article {
  title: String;
  htmlTitle?: String;
  blurb: String;
  content: String;
  author: ArticleAuthor;
  pictureId?: String;
};

export interface HeroIcon {
  icon: string;
  style?: 'outline' | 'solid';
  classes?: string;
};

export interface Route {
  routeMatcher: string | string[];
  get?: (req: Request, res: Response, next: NextFunction) => void;
  head?: (req: Request, res: Response, next: NextFunction) => void;
  post?: (req: Request, res: Response, next: NextFunction) => void;
  put?: (req: Request, res: Response, next: NextFunction) => void;
  delete?: (req: Request, res: Response, next: NextFunction) => void;
  connect?: (req: Request, res: Response, next: NextFunction) => void;
  options?: (req: Request, res: Response, next: NextFunction) => void;
  trace?: (req: Request, res: Response, next: NextFunction) => void;
  patch?: (req: Request, res: Response, next: NextFunction) => void;
}
