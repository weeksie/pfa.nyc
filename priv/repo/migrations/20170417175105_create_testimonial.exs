defmodule PFA.Repo.Migrations.CreateTestimonial do
  use Ecto.Migration

  def change do
    create table(:testimonials) do
      add :text, :text
      add :person, :string
      add :company, :string
      add :url, :string

      timestamps()
    end

  end
end
