import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

//imports de entidades relacionadas
/**
 * CREATE TABLE `inv_recipe_mix` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipe_id` int NOT NULL,
  `recipe_group` varchar(10) NOT NULL,
  `recipe_base_id` int DEFAULT NULL,
  `recipe_flavor_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `quantity` decimal(16,3) DEFAULT '0.000',
  `presentation_id` int DEFAULT NULL,
  `measure_id` int DEFAULT NULL,
  `status` smallint NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `recipe_has_mix_idx` (`recipe_id`),
  CONSTRAINT `recipe_has_mix` FOREIGN KEY (`recipe_id`) REFERENCES `inv_recipe` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

 * 
 */

import { Recipe } from './Recipe'

@Entity({ name: 'inv_recipe_mix' })
export class RecipeMix {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'int' })
  recipe_id: number

  @Column({ type: 'varchar' })
  recipe_group: string

  @Column({ type: 'int' })
  recipe_base_id: number

  @Column({ type: 'int' })
  recipe_flavor_id: number

  @Column({ type: 'int' })
  item_id: number

  @Column({ type: 'decimal' })
  quantity: number

  @Column({ type: 'int' })
  presentation_id: number

  @Column({ type: 'int' })
  measure_id: number

  @Column({ type: 'smallint' })
  status: number

  @ManyToOne(() => Recipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe
}
