const AmiiboList = ({ results }) => {
    return results.map(amiibo => (
        <span key={amiibo.head + amiibo.tail} style={{ color: "green" }}>
          <h4>{amiibo.name}</h4>
          <img
            width="100"
            alt={amiibo.character}
            src={amiibo.image}
          />
        </span>
      ));
};

export default AmiiboList;