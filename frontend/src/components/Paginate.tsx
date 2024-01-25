import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

interface PaginateProps {
  pages: number;
  page: number;
  isAdmin?: boolean;
}

const Paginate: React.FC<PaginateProps> = ({ pages, page, isAdmin = false }) => {
  if (pages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-4 flex justify-center">
      {[...Array(pages).keys()].map((x) => (
        <LinkContainer
          key={x + 1}
          to={
            !isAdmin
              ? `/page/${x + 1}`
              : `/admin/productlist/${x + 1}`
          }>
          <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
};

export default Paginate;


