import { Link } from "react-router-dom";

type CardType = {
  thumbnail?: string | undefined; // Made optional
  date?: string;
  title?: string;
  description?: string;
  callToActionText?: string;
  calllToActionLink: string;
};

const Card = ({
  thumbnail,
  date,
  title,
  description,
  callToActionText,
  calllToActionLink,
}: CardType) => {
  return (
    <div className="w-full max-w-2xl h-full md:h-[480px] 2xl:h-[600px] border-[1px] border-[color:white] rounded-md hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-[color:var(--c-bg)]">
      <Link to={calllToActionLink}>
        <article className="w-full h-full">
          <figure className="w-full border-b-[1px] border-b-[color:white]">
            <img
              src={thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="px-6 py-5 text-left h-full">
            {date && <p className="text-base mb-4 text-[color:var(--c-fg)]">{date}</p>}
            {title && (
              <h1 className="text-[32px] leading-8 font-bold mb-4 text-[color:var(--c-fg)]">{title}</h1>
            )}
            {description && (
              <p className="text-xs mb-4 line-clamp-2 lg:line-clamp-4 text-[color:var(--c-fg)]">
                {description}
              </p>
            )}
            {callToActionText && <strong>{callToActionText}</strong>}
          </div>
        </article>
      </Link>
    </div>
  );
};

export default Card;
